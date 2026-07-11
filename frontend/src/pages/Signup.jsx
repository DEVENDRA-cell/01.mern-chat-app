import React,{useState} from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { serverUrl } from '../config.js'
import { setSelectedUser, setUserData } from '../redux/userSlice'
import { useDispatch, useSelector} from 'react-redux'
import { getOrCreateDeviceId, setupKeysForUser, uploadPublicKey } from "../utils/cryptoUtils";
function Signup() {
    let navigate = useNavigate()
    let [username, setUsername] = React.useState('')
    let [email, setEmail] = React.useState('')
    let [password, setPassword] = React.useState('')
    let [error, setError] = React.useState(null)
    let {userData} = useSelector((state) => state.user)
    let dispatch = useDispatch()

const handleSignup = async (e) => {
    e.preventDefault();
    setError(null);

    try {
        const { data } = await axios.post(
            serverUrl + "/api/auth/signup",
            { username, email, password },
            { withCredentials: true }
        );

        dispatch(setUserData(data.user));
        dispatch(setSelectedUser(null)); // Clear selected user after signup

        setUsername("");
        setEmail("");
        setPassword("");
// ...inside your existing async submit handler, right after login succeeds:
const publicKey = await setupKeysForUser(data.user._id); // got public key and stored private key in localStorage
const deviceId = getOrCreateDeviceId();  // it store and return the deviceId from localStorage.
console.log("My public key (Day 2 sends this to the backend):", publicKey);
console.log("My device ID:", deviceId); 
if(publicKey) {
    await uploadPublicKey({ deviceId, publicKey });
}
    } catch (error) {
        console.error("Signup error:", error);

        setError(
            error.response?.data?.message || "Signup failed"
        );
    }
};
 
  return (
    <div className="p-4 text-center text-2xl font-bold text-gray-800 min-h-screen flex items-center justify-center"> 
      <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded shadow">
      <h1>Welcome to LetsChat!</h1>

      
        <p className="text-sm text-gray-500 mt-2">Create an account to start chatting with your friends.</p>
        <form className="mt-6 space-y-4" onSubmit={handleSignup}>
            <input type="text" placeholder="Username" className="w-full p-2 border border-gray-300 rounded" value={username} onChange={(e) => setUsername(e.target.value)} />
            <input type="email" placeholder="Email" className="w-full p-2 border border-gray-300 rounded" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input type="password" placeholder="Password" className="w-full p-2 border border-gray-300 rounded" value={password} onChange={(e) => setPassword(e.target.value)} />
                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
                Sign Up
            </button>
            <p className="text-sm text-gray-500 mt-4">Already have an account? <a href="/login" className="text-blue-500 hover:underline">Login</a></p>
        </form>
        </div>
    </div>
  )
}

export default Signup