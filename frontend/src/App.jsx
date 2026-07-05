import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import getCurrentUser from './customHooks/getCurrentUser.jsx'
import { useSelector } from 'react-redux'
import Profile from './pages/Profile'
import getOtherUsers from './customHooks/getOtherUser.jsx'

function App() {
  getCurrentUser();
  getOtherUsers();  
  let {userData,loading} = useSelector((state) => state.user)
  if (loading) {
    return <div>Loading...</div>; 
  }
    return (
<Routes>
    <Route path="/login" element={<Login />} />
    <Route path="/signup" element={<Signup />} />
    <Route path="/" element={<Home />} />
    <Route path="/profile" element={<Profile />} />
</Routes>
    )
}
// So authentication logic belongs closer to App than main.
export default App