import React, { useEffect } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import getCurrentUser from './customHooks/getCurrentUser.jsx'
import { useDispatch, useSelector } from 'react-redux'
import Profile from './pages/Profile'
import useGetOtherUsers from './customHooks/getOtherUser.jsx'
import io from 'socket.io-client';
import { serverUrl } from './config.js'
import { setOnlineUsers, setSocket } from './redux/userSlice.js'
function App() {
  
  getCurrentUser();

  const fetchOtherUsers = useGetOtherUsers();


  const {
    userData,
    isCheckingAuth
  } = useSelector((state) => state.user);


  const dispatch = useDispatch();


  useEffect(() => {

    if (!userData?._id) return;


    const socketio = io(serverUrl, {

      query: {

        userId: userData._id

      }

    });


    dispatch(setSocket(socketio));


    const handleOnlineUsers = (onlineUsersList) => {

      dispatch(
        setOnlineUsers(onlineUsersList)
      );

    };


    const handleRefreshUsers = () => {

      console.log("NEW USER EVENT RECEIVED");

      fetchOtherUsers();

    };


    socketio.on(
      "getOnlineUsers",
      handleOnlineUsers
    );


    socketio.on(
      "refreshUsers",
      handleRefreshUsers
    );


    return () => {

      socketio.off(
        "getOnlineUsers",
        handleOnlineUsers
      );

      socketio.off(
        "refreshUsers",
        handleRefreshUsers
      );

      socketio.close();

    };


  }, [
    userData?._id,
    dispatch,
    fetchOtherUsers
  ]);


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