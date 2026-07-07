import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import dp from '../assets/hero.png'
import { IoSearch } from "react-icons/io5";
import { RxCross1 } from "react-icons/rx";
import { IoLogOut } from "react-icons/io5";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {serverUrl} from '../config.js';
import { setOtherUsers, setSearchResults, setSelectedUser, setUserData } from '../redux/userSlice.js';
import { useEffect } from 'react';
function Sidebar() {
    let [search,setSearch] = React.useState(false)
    let userData = useSelector((state) => state.user.userData);
    let otherUsers = useSelector((state) => state.user.otherUsers);
    let onlineUsers = useSelector((state) => state.user.onlineUsers);
    let searchResults = useSelector((state) => state.user.searchResults);
    let dispatch = useDispatch();
    let navigate = useNavigate();
    let selectedUser = useSelector((state) => state.user.selectedUser);
    let [searchinput, setSearchInput] = React.useState("");
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
const handleSearch = async () => {
  try {
    if (searchinput.trim() === "") {
      dispatch(setSearchResults([]));
      return;
    }

    const result = await axios.get(
      `${serverUrl}/api/user/search`,
      {
        params: {
          query: searchinput,
        },
        withCredentials: true,
      }
    );

    dispatch(setSearchResults(result.data));

    console.log("Search results:", result.data);
  } catch (error) {
    console.error("Error during search:", error);
  }
};

useEffect(() => {
  handleSearch();
}, [searchinput]);
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
    overflow-hidden
  `}
>
  {/* Fixed header section */}
  <div className="flex items-center justify-between mb-4 px-4 pt-4">
    <IoLogOut className="text-xl cursor-pointer text-white" onClick={handleLogout} />
  </div>

  <div className="text-2xl font-bold text-gray-300 mb-4 flex items-center justify-center">
    <h1>LetsChat</h1>
  </div>

  <div className="flex flex-col items-center justify-center mb-4">
    <div className='text-lg font-medium text-gray-300'>
      Hii, {userData?.name || userData?.username || 'Guest'}!
    </div>
    <div className="mt-2 flex items-center justify-between" onClick={() => navigate('/profile')}>
      <img src={userData?.image || dp} alt="Profile" className="w-20 h-20 rounded-full cursor-pointer" />
    </div>
  </div>

  {/* Fixed search bar — toggles between icon and input, stays out of scroll area */}
<div className="flex items-center gap-3 mb-4 px-4">

  {!search ? (
    <>
      {/* Search Button */}
      <div
        className="bg-gray-600 text-white p-2 rounded-lg cursor-pointer 
                   flex items-center justify-center hover:bg-gray-500 transition-colors
                   shrink-0" 
        onClick={() => setSearch(true)}
      >
        <IoSearch className="text-xl"  />
      </div>

      {/* Online Users */}
      <div className="flex items-center gap-2 overflow-x-auto">
        {otherUsers?.map(
          (user) =>
            onlineUsers?.includes(user._id) && (
              <div 
                key={user._id}
                className="relative shrink-0 cursor-pointer hover:scale-105 transition-transform"
                onClick={() => dispatch(setSelectedUser(user))}
              >
                <img
                  src={user.image || dp}
                  alt="Profile"
                  className="w-10 h-10 rounded-full object-cover"
                />

                {/* Green Online Dot */}
                <span
                  className="absolute bottom-0 right-0 
                             w-3 h-3 bg-green-500 
                             rounded-full border-2 border-gray-800"
                />
              </div>
            )
        )}
      </div>
    </>
  ) : (
    /* Search Form */
    <form
      className="flex items-center gap-2 bg-gray-600 rounded-lg p-2 flex-1"
      onSubmit={(e) => e.preventDefault()}
    >
      <IoSearch className="text-white text-xl shrink-0" />

      <input
        type="text"
        placeholder="Search..."
        autoFocus
        className="bg-transparent text-white placeholder:text-gray-400 
                   outline-none flex-1 min-w-0" value={searchinput}
      onChange={(e)=>setSearchInput(e.target.value)} 
      />

      <RxCross1
        className="text-white text-xl cursor-pointer shrink-0"
        onClick={() => {
          setSearch(false);
          setSearchInput("");
        }}
      />

    </form>
  )}

</div>
{/* Scrollable user list only */}
  <div className="relative w-full flex-1 overflow-y-auto">
    <div className="w-full flex flex-col gap-2 px-2 pb-4">
      {otherUsers?.map((user) => (
        <div
          key={user._id}
          className="bg-gray-700 p-2 rounded-lg cursor-pointer hover:bg-gray-600 transition-colors"
          onClick={() => dispatch(setSelectedUser(user))}
        >
          <div className="flex items-center gap-2">
            <img src={user.image || dp} alt="Profile" className="w-10 h-10 rounded-full object-cover" />
            <div className="text-sm font-medium text-gray-300">{user.name || user.username}</div>
          </div>
        </div>
      ))}
    </div>

    {searchinput?.length > 0 && (
      <div className="absolute top-0 left-0 right-0 bottom-0 bg-gray-800 overflow-y-auto rounded-lg shadow-lg z-10 flex flex-col gap-2 px-2 pb-4 pt-2">
        {searchResults?.map((user) => (
          <div
            key={user._id}
            className="bg-gray-700 p-2 rounded-lg cursor-pointer hover:bg-gray-600 transition-colors"
            onClick={() => {
              dispatch(setSelectedUser(user));
              setSearch(false);
              setSearchInput("");
              dispatch(setSearchResults([]));
            }}
          >
            <div className="flex items-center gap-2">
              <img src={user.image || dp} alt="Profile" className="w-10 h-10 rounded-full object-cover" />
              <div className="text-sm font-medium text-gray-300">{user.name || user.username}</div>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
</div>
  )
}

export default Sidebar