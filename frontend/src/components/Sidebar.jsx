import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import dp from '../assets/hero.png'
import { IoSearch } from "react-icons/io5";
import { RxCross1 } from "react-icons/rx";
import { IoLogOut } from "react-icons/io5";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {serverUrl} from '../config.js';
import { setOtherUsers, setSelectedUser, setUserData } from '../redux/userSlice.js';
function Sidebar() {
    let [search,setSearch] = React.useState(false)
    let userData = useSelector((state) => state.user.userData);
    let otherUsers = useSelector((state) => state.user.otherUsers);
    let dispatch = useDispatch();
    let navigate = useNavigate();
    let selectedUser = useSelector((state) => state.user.selectedUser);
    console.log("otherUsers in Sidebar:", otherUsers);
    const handleLogout = async () => {
        try{
            let result =await axios.post(serverUrl + '/api/auth/logout',{}, { withCredentials: true });
            if(result.status === 200){
                dispatch(setUserData(null));
                dispatch(setOtherUsers(null)); // why? because when user logs out, we want to clear the other users data from the redux store as well. This is to ensure that when a new user logs in, they don't see the previous user's data. We want to start fresh for each user.
            }
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };

  return (
    // <div className={`bg-gray-800 text-white w-full lg:w-[30%] h-screen p-4 lg:block ${selectedUser ? 'hidden' : 'block'}`}>
        <div
className={`
    bg-gray-800
    ${selectedUser ? "hidden" : "flex"}
    lg:flex
    flex-col
    w-full
    lg:w-[30%]
    h-full
    border-r
`}
>
        <div className="flex items-center justify-between mb-4">
        <IoLogOut className="text-xl cursor-pointer text-white" onClick={handleLogout} />
        </div>
        <div className="text-2xl font-bold text-gray-300 mb-4 flex items-center justify-center">
                <h1>LetsChat</h1>
                </div>
          <div className="flex flex-col items-center justify-center mb-4">
                <div className='text-lg font-medium text-gray-300 '>
                    Hii, {userData?.name || userData?.username || 'Guest'}!
                </div>
                <div className="mt-2 flex items-center justify-between" onClick={() => {navigate('/profile')}}>
                    <img src={userData?.image || dp} alt="Profile" className="w-20 h-20 rounded-full" />
                </div>
          </div>
          {!search && (
            <div className="bg-gray-600 text-white p-2 rounded-lg cursor-pointer" onClick={() => {setSearch(true)}}>
              <IoSearch  className="bg-black-600 text-xl cursor-pointer rounded-lg w-full flex items-center justify-center" />
            </div>
          )}
          <div className="mt-4 w-full flex flex-col gap-2 " >
            {search && ( <form className="mt-2 flex items-center justify-between gap-2">
                    <IoSearch  className="bg-black-600 text-xl cursor-pointer rounded-lg w-full  " />
                    <input type="text" placeholder="Search..." className="bg-gray-600 text-white placeholder:text-gray-400 border border-gray-300 rounded " />
                    <RxCross1  className="bg-black-600 text-xl cursor-pointer rounded-lg w-full  " onClick={() => {setSearch(false)}} />
                    <button type="submit" className="bg-gray-600 text-white p-2 rounded hover:bg-gray-500 ">Search</button>
                </form>
                )}
                {otherUsers?.map((user) => (
                <div key={user._id} className="bg-gray-700 p-2 rounded-lg cursor-pointer hover:bg-gray-600" onClick={() => dispatch(setSelectedUser(user))}>
                    <div className="flex items-center gap-2">
                        <img src={user.image || dp} alt="Profile" className="w-10 h-10 rounded-full" />
                        <div className="text-sm font-medium text-gray-300">{user.name || user.username}</div>
                    </div>  
                    </div>     
                ))}
            </div>
    </div>
  )
}

export default Sidebar