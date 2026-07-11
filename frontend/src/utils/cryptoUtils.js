import axios from "axios";
import { serverUrl } from "../config";
const STORAGE_KEY = "chat_ecdh_private_jwk";


export async function generateKeyPair() {
  return window.crypto.subtle.generateKey(
    { name: "ECDH", namedCurve: "P-256" },
    true,
    ["deriveKey", "deriveBits"] 
  );
}

export async function exportKey(key) {
  return window.crypto.subtle.exportKey("jwk", key);
}
// jwk->cryptoKey
export async function importKey(jwk, usages) {
  return window.crypto.subtle.importKey(
    "jwk",
    jwk,
    { name: "ECDH", namedCurve: "P-256" },
    true,
    usages
  );
}

// frontend/src/utils/cryptoUtils.js — patch to Day 1

function storageKeyFor(userId) {
  return `chat_ecdh_private_jwk_${userId}`;
}

export async function setupKeysForUser(userId) {
  const key = storageKeyFor(userId);
  const existingPrivateJwk = localStorage.getItem(key);
  if (existingPrivateJwk) {
    console.log("Reusing existing key pair for this user on this browser.");
    return JSON.parse(existingPrivateJwk);
  }

  const { publicKey, privateKey } = await generateKeyPair();
  const publicJwk = await exportKey(publicKey);
  const privateJwk = await exportKey(privateKey);

  localStorage.setItem(key, JSON.stringify(privateJwk));

  console.log("Generated new key pair for user", userId);
  return publicJwk;
}

// when it's time to derive a shared secret or decrypt.
export function getStoredPrivateKeyJwk(userId) {
  const raw = localStorage.getItem(storageKeyFor(userId));
  return raw ? JSON.parse(raw) : null;
}

export async function uploadPublicKey({ deviceId, publicKey }) {
  await axios.put(
    `${serverUrl}/api/user/updatePublicKey`, // adjust to match your actual route + base URL setup
    { deviceId, publicKey },
    { withCredentials: true } // needed since your auth is cookie-based (see authController.js)
  );
}

export function getOrCreateDeviceId() {
  let deviceId = localStorage.getItem("chat_device_id");
  if (!deviceId) {
    deviceId = crypto.randomUUID();
    localStorage.setItem("chat_device_id", deviceId);
  }
  return deviceId;
}


export async function deriveSharedAesKey(myPrivateKey, theirPublicJwk, myDeviceId, theirDeviceId) {
  // 1. Import their public key. Empty usages array - see Day 1's gotcha:
  //    a public key isn't "used" via its own usages, it's passed as
  //    the `public` parameter to deriveBits below.
  const theirPublicKey = await importKey(theirPublicJwk, []);

  // 2. ECDH: raw shared secret bits - identical on both sides.
  const sharedBits = await window.crypto.subtle.deriveBits(
    { name: "ECDH", public: theirPublicKey },
    myPrivateKey,
    256
  );
  // shared bits is a raw ArrayBuffer of 32 bytes (256 bits). 
  // 3. Import those raw bits as HKDF input keying material. ( hkdf takes cryptoKey as input, not raw bytes)
  const hkdfBaseKey = await window.crypto.subtle.importKey(
    "raw",
    sharedBits,
    "HKDF",
    false,
    ["deriveKey"]
  );

  // 4. HKDF -> a real AES-256-GCM key, bound to this device pair.
  // sorting ensures both sides derive the same key regardless of who is "my" and who is "their" (device id)
  const sortedIds = [myDeviceId, theirDeviceId].sort().join(":");
  // Why TextEncoder()?
  // HKDF doesn't accept a JavaScript string for info.
  // It needs bytes
  const info = new TextEncoder().encode(`chat-e2ee:${sortedIds}`);

  const aesKey = await window.crypto.subtle.deriveKey(
    {
      name: "HKDF",
      hash: "SHA-256",
      salt: new Uint8Array(0),
      info,
    },
    hkdfBaseKey,
    { name: "AES-GCM", length: 256 },
    false, // not extractable - it never needs to leave the browser as raw bytes
    ["encrypt", "decrypt"]
  );
  // hands back a ready `AES-256-GCM` `CryptoKey`
  return aesKey;
}

export async function encryptMessage(aesKey, plaintext) {
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const encodedText = new TextEncoder().encode(plaintext);
  // subtle.encrypt` only operates on raw bytes, not JS strings, so this converts your message into a `Uint8Array` of UTF-8 bytes first.
  const ciphertextBuffer = await window.crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    aesKey,
    encodedText
  );

  return {
    ciphertext: arrayBufferToBase64(ciphertextBuffer),
    iv: arrayBufferToBase64(iv),
    // both get base64-encoded (see 4c below) because this will eventually travel inside a JSON payload over Socket.io/HTTP, which can only carry text, not raw binary.
  };
}

export async function decryptMessage(aesKey, ciphertextBase64, ivBase64) {
  const ciphertext = base64ToArrayBuffer(ciphertextBase64);
  const iv = base64ToArrayBuffer(ivBase64);
// got raw bytes.
  const decryptedBuffer = await window.crypto.subtle.decrypt(
    { name: "AES-GCM", iv: new Uint8Array(iv) },
    aesKey,
    ciphertext
  );

  return new TextDecoder().decode(decryptedBuffer);
  // TextDecoder converts the decrypted raw bytes back into a JavaScript string.
}

function arrayBufferToBase64(buffer) {
  const bytes = new Uint8Array(buffer);
  // make buffer readable and accessible.
  let binary = "";
  // convert each byte to a character and append to binary string.
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
  // btoa() is a browser function that converts a binary string into Base64.
}

function base64ToArrayBuffer(base64) {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

const sessionKeyCache = new Map();

export async function getMyPrivateKey(userId) {
  const jwk = getStoredPrivateKeyJwk(userId);
  if (!jwk) {
    throw new Error("No private key found for this user on this device.");
  }
  return importKey(jwk, ["deriveKey", "deriveBits"]);
} // it ll return key object 

export async function getSessionKey(myUserId, myPrivateKey, otherUser) {
  const cacheKey = `${myUserId}:${otherUser._id}`;
  if (sessionKeyCache.has(cacheKey)) {
    return sessionKeyCache.get(cacheKey);
  }

  if (!otherUser.publicKeys || otherUser.publicKeys.length === 0) {
    throw new Error(`${otherUser.username} has no registered device keys yet.`);
  }

  // Stage 5 only handles one device pair - just take their first
  // registered device. Stage 6 replaces this with a loop over all of them.
  const theirEntry = otherUser.publicKeys[0];
  const theirPublicJwk = JSON.parse(theirEntry.key);
  const myDeviceId = getOrCreateDeviceId();

  const aesKey = await deriveSharedAesKey(myPrivateKey, theirPublicJwk, myDeviceId, theirEntry.deviceId);
  sessionKeyCache.set(cacheKey, aesKey);
  return aesKey;
}

export async function decryptStoredMessage(sessionKey, messageDoc) {
  if (!messageDoc.ciphertext) {
    return messageDoc; // image-only message - nothing to decrypt
  }
  const plaintext = await decryptMessage(sessionKey, messageDoc.ciphertext, messageDoc.iv);
  return { ...messageDoc, message: plaintext };
}