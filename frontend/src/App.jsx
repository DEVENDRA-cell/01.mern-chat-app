import React, { useEffect } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import getCurrentUser from './customHooks/getCurrentUser.jsx'
import { useDispatch, useSelector } from 'react-redux'
import Profile from './pages/Profile'
import getOtherUsers from './customHooks/getOtherUser.jsx'
import io from 'socket.io-client';
import { serverUrl } from './config.js'
import { setOnlineUsers, setSocket } from './redux/userSlice.js'
function App() {
  getOtherUsers();  
  const {userData, isCheckingAuth,socket,onlineUsers} = useSelector((state) => state.user)
  let dispatch = useDispatch();

getCurrentUser();

useEffect(() => {
  if (!userData?._id) return;
  if(userData) { // Check if userData is available and socket is not already initialized
    const socketio = io(`${serverUrl}`, {
      query: {
        userId: userData?._id, // Send the user ID as a query parameter
      },
    });
    dispatch(setSocket(socketio)); // Store the socket instance in Redux state
    socketio.on("getOnlineUsers", (onlineUsersList) => {
      dispatch(setOnlineUsers(onlineUsersList)); // Update the online users list in Redux state
    });
    return () => {
      socketio.close(); 
    };
  }
  }, [userData?._id]);

if (isCheckingAuth) {
    return <div>Loading...</div>;
}
    return (
<Routes>
  <Route
    path="/"
    element={userData ? <Home /> : <Navigate to="/login" />}
/>

<Route
    path="/profile"
    element={userData ? <Profile /> : <Navigate to="/login" />}
/>
<Route
  path="/login"
  element={!userData ? <Login /> : <Navigate to={userData.image ? "/" : "/profile"} />}
/>
<Route
  path="/signup"
  element={!userData ? <Signup /> : <Navigate to={userData.image ? "/" : "/profile"} />}
/>
</Routes>
    )
}
// So authentication logic belongs closer to App than main.
export default App