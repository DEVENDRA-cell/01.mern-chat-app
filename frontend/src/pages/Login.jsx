import React,{useState} from 'react'
import { useNavigate } from 'react-router-dom'
import { serverUrl } from '../config.js'
import axios from 'axios'
import { useDispatch  } from 'react-redux'
import { setUserData } from '../redux/userSlice'
function Login() {
    let navigate = useNavigate()
    let [email, setEmail] = React.useState('')
    let [password, setPassword] = React.useState('')
    let [error, setError] = React.useState(null)
    let [loading, setLoading] = React.useState(false)
    let dispatch = useDispatch()
const handleLogin = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError(null);

    try {
        const { data } = await axios.post(
            serverUrl + "/api/auth/login",
            { email, password },
            { withCredentials: true }
        );

        dispatch(setUserData(data));

        setEmail("");
        setPassword("");

        if (data.user.image) {
            navigate("/");
        } else {
            navigate("/profile");
        }

    } catch (error) {
        console.error(error);

        setError(
            error.response?.data?.message || "Login failed"
        );
    } finally {
        setLoading(false);
    }
}; 
    return (
    <div className="p-4 text-center text-2xl font-bold text-gray-800 min-h-screen flex items-center justify-center"> 
      <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded shadow">
      <h1>Welcome to LetsChat!</h1>

      
        <p className="text-sm text-gray-500 mt-2">Login to your account to start chatting with your friends.</p>
        <form className="mt-6 space-y-4" onSubmit={handleLogin}>
            <input type="email" placeholder="Email" className="w-full p-2 border border-gray-300 rounded" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input type="password" placeholder="Password" className="w-full p-2 border border-gray-300 rounded" value={password} onChange={(e) => setPassword(e.target.value)} />
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600" disabled={loading}>
                {loading ? "Logging In..." : "Login"}
            </button>
            <p className="text-sm text-gray-500 mt-4">Don't have an account? <a href="/signup" className="text-blue-500 hover:underline">Sign Up</a></p>
        </form>
        </div>
    </div>
  )
}

export default Login