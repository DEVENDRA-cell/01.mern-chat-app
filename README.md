# SecureChat — Real-Time End-to-End Encrypted Chat Application

**Live Demo:** "https://01-mern-chat-app-8lm6.vercel.app"

SecureChat is a full-stack real-time messaging application built with the MERN stack and Web Crypto API.

Unlike traditional chat applications where the server can access message content, SecureChat performs encryption and decryption entirely on the client. The backend and database store only encrypted ciphertext and cryptographic metadata.

## Features

- Real-time one-to-one messaging using Socket.IO
- Live user presence and online/offline tracking
- Client-side end-to-end encryption
- ECDH P-256 key agreement using Web Crypto API
- HKDF-based symmetric key derivation
- AES-256-GCM authenticated message encryption
- Per-user public/private key generation
- Private keys remain on the client device
- Session key caching to avoid unnecessary key derivation
- JWT-based authentication
- Secure cross-origin authentication
- Image upload and delivery using Cloudinary
- Responsive React frontend
- Production deployment using Vercel and Render

## Encryption Architecture

SecureChat uses a hybrid cryptographic architecture:

1. Each client generates an ECDH P-256 public/private key pair using the Web Crypto API.
2. The private key remains on the user's device.
3. Public keys are stored on the backend and exchanged between users.
4. ECDH is used to derive a shared secret between two users.
5. HKDF derives a 256-bit symmetric encryption key from the shared secret.
6. Messages are encrypted using AES-256-GCM before leaving the sender's browser.
7. The backend stores and forwards only encrypted ciphertext.
8. The recipient decrypts the message locally using the derived session key.

```text
Sender Browser
      |
      |  Plaintext Message
      v
ECDH + HKDF
      |
      v
AES-256-GCM Encryption
      |
      |  Ciphertext Only
      v
Node.js + Socket.IO + MongoDB
      |
      |  Ciphertext Only
      v
Recipient Browser
      |
      v
AES-256-GCM Decryption
      |
      v
Plaintext Message
Tech Stack
Frontend
React
Vite
Redux Toolkit
Axios
Socket.IO Client
Web Crypto API
Backend
Node.js
Express.js
Socket.IO
MongoDB
Mongoose
JWT Authentication
Cloudinary
Deployment
Frontend — Vercel
Backend — Render
Database — MongoDB Atlas
Project Structure
01-chat-app/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── socket/
│   └── index.js
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── customHooks/
│   │   ├── pages/
│   │   └── utils/
│   └── package.json
│
└── README.md
Running Locally
1. Clone the repository
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd 01-chat-app
2. Configure the backend
cd backend
npm install

Create a .env file:

PORT=3000
MONGO_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

FRONTEND_URL=http://localhost:5173

Start the backend:

npm run dev
3. Configure the frontend
cd frontend
npm install

Create a .env file:

VITE_SERVER_URL=http://localhost:3000

Start the frontend:

npm run dev

Open the application at:

http://localhost:5173
Security Notes
Private cryptographic keys are never sent to the backend.
Message encryption and decryption happen entirely in the browser.
MongoDB stores encrypted message content rather than plaintext.
AES-GCM provides both confidentiality and message integrity.
Environment variables and credentials are excluded from version control.
Current Limitations

The current encryption architecture does not yet implement a Double Ratchet protocol or full forward secrecy for every individual message.

Future improvements include:

Double Ratchet-based key evolution
Cryptographic identity verification
Enhanced multi-device key synchronization
Encrypted media attachments
Automated security testing
Author

Devendra Rathore

Built as a full-stack and applied cryptography project using the MERN stack and Web Crypto API