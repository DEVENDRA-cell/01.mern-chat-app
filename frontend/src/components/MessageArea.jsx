import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { IoMdArrowRoundBack } from "react-icons/io";
import dp from '../assets/hero.png'
import { setSelectedUser } from '../redux/userSlice.js';
import { MdEmojiEmotions } from "react-icons/md";
import { FaImage } from "react-icons/fa6";
import { IoSend } from "react-icons/io5";
import {useState} from 'react'
import EmojiPicker from 'emoji-picker-react';
import SenderMessage from './SenderMessage.jsx';
import RecieverMessage from './RecieverMessage.jsx';
function MessageArea() {
    let userData = useSelector((state) => state.user.userData);
    let selectedUser = useSelector((state) => state.user.selectedUser);
    let [showpicker, setShowpicker] = React.useState(false);
    let [inputMessage, setInputMessage] = React.useState('');
    const handleEmojiClick = (emojiObject) => {
        setInputMessage((prevMessage) => prevMessage + emojiObject.emoji);
        // You can handle the selected emoji here, e.g., add it to the message input field.
    }
    let dispatch = useDispatch();
  return (
    // <div className={`lg:w-[70%]  ${selectedUser ? 'flex' : 'hidden'} lg:flex w-full h-full  `}>
        <div
className={`
    ${selectedUser ? "flex" : "hidden"}
    lg:flex 
    flex-col
    flex-1
    h-full relative 
`}
>                       

        {selectedUser && (
            <div  >
            <div className='flex items-center justify-between px-4 py-2 border-b border-gray-300 bg-gray-800 border-opacity-20 shadow-md'>
                <div className='flex items-center gap-2 text-white  border-white shadow-md' >
                    <div className='flex items-center justify-center w-10 h-10 rounded-full bg-gray-300 cursor-pointer' onClick={() => dispatch(setSelectedUser(null))}>
                    <IoMdArrowRoundBack className='text-gray-500  cursor-pointer' />
                    </div>
                    <img src={selectedUser?.image || dp} alt="profile" className='w-10 h-10 rounded-full object-cover' />
                    <h1 className='text-lg font-semibold'>{selectedUser?.name || selectedUser?.username }</h1>
                </div>
            </div>
            <div className=' bg-gray-300 h-[500px] p-4 w-full ' >
  <div className='flex flex-col gap-2 h-full overflow-y-auto'>
    {showpicker && (
        <div className='absolute bottom-20 left-4 z-50'>
      <EmojiPicker onEmojiClick={handleEmojiClick}/>
        </div>
    )}
            <SenderMessage />
            <RecieverMessage />
            <SenderMessage />
  </div>
            </div>
            </div>
        )}



       {!selectedUser && (
        <div className='flex items-center justify-center h-full'>
            <h1 className='text-2xl font-semibold text-gray-500'>Select a user to start chatting</h1>
        </div>
       )}
       {selectedUser && (
        <div className='flex items-center justify-between px-4 py-2 border-t border-gray-300 bg-gray-800 border-opacity-20 shadow-md absolute bottom-0 w-full'>
   
        <form className='flex items-center justify-between gap-2 w-full h-full px-4 py-2'>
            <div className='flex items-center justify-center w-10 h-10 rounded-full bg-gray-300 cursor-pointer' onClick={() => setShowpicker(!showpicker)}>
            <MdEmojiEmotions />
            </div>
            <input type="text" placeholder='Type a message...' className='w-full h-full bg-transparent outline-none text-black  placeholder-gray-400' value={inputMessage} onChange={(e) => setInputMessage(e.target.value)} />
            <div className='flex items-center justify-center w-10 h-10 rounded-full bg-gray-300 cursor-pointer'>
            <FaImage />
            </div>
            <div className=' flex items-center justify-center w-10 h-10 rounded-full bg-gray-300 cursor-pointer'>
                <IoSend />
            </div>

            </form>
            </div>
       )}
    </div>
  )
}

export default MessageArea