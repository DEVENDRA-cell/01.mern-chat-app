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
import axios from 'axios';
import { serverUrl } from '../config.js';
import { setMessages } from '../redux/messageSlice.js';
import { useEffect, useRef } from 'react';
import { getMyPrivateKey, getSessionKey } from '../utils/cryptoutils.js';
function MessageArea() {
    let userData = useSelector((state) => state.user.userData);
    let selectedUser = useSelector((state) => state.user.selectedUser);
    console.log('selectedUser', selectedUser);
    let onlineUsers = useSelector((state) => state.user.onlineUsers);
    let {socket} = useSelector((state) => state.user);
    let [showpicker, setShowpicker] = React.useState(false);
    let [inputMessage, setInputMessage] = React.useState('');
    const handleEmojiClick = (emojiObject) => {
        setInputMessage((prevMessage) => prevMessage + emojiObject.emoji);
        // You can handle the selected emoji here, e.g., add it to the message input field.
    }
    let image = React.useRef(null);
    let dispatch = useDispatch();
    let [frontendImage, setFrontendImage] = useState(null);
    let [backendImage, setBackendImage] = useState(null);
    let {messages} = useSelector((state) => state.message);
    const lastMessageRef = useRef(null);

useEffect(() => {
    lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
}, [messages]);
    const  handleSendMessage = async () => {
      if(inputMessage.length==0 && !backendImage) {
        return null; // Don't send empty messages
      }
        try { 
    const myPrivateKey = await getMyPrivateKey(userData._id);
    const sessionKey = await getSessionKey(userData._id, myPrivateKey, selectedUser);

            let formData = new FormData();
            if (inputMessage.length > 0) {
              const { ciphertext, iv } = await encryptMessage(sessionKey, inputMessage);
              formData.append('ciphertext', ciphertext);
              formData.append('iv', iv);
            }
            if(backendImage) {
                formData.append('profileimg', backendImage);
            }
            let result = await axios.post(`${serverUrl}/api/message/send/${selectedUser._id}`, formData, { withCredentials: true });

            const decrypted = await decryptStoredMessage(sessionKey, result.data);
            dispatch(setMessages([...messages, decrypted]));
            setInputMessage(''); // Clear the input field after sending
            setFrontendImage(null); // Clear the frontend image preview
            setBackendImage(null); // Clear the backend image reference
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    useEffect(() => {
      if (!socket) return;
      socket.on("newMessage", async (newMessage) => {
      if (!selectedUser || newMessage.sender !== selectedUser._id) return;
      const myPrivateKey = await getMyPrivateKey(userData._id);
      const sessionKey = await getSessionKey(userData._id, myPrivateKey, selectedUser);
      const decrypted = await decryptStoredMessage(sessionKey, newMessage);
      dispatch(setMessages([...messages, decrypted]));
      });
      return () => {
        socket.off("newMessage");
    };
}, [messages, socket, userData, selectedUser]);
  return (
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
        <div className="flex flex-col h-full">
          <div className='flex items-center justify-between px-4 py-2 border-b border-gray-300 bg-gray-800 border-opacity-20 shadow-md'>
            <div className='flex items-center gap-2 text-white  border-white shadow-md' >
              <div className='flex items-center justify-center w-10 h-10 rounded-full bg-gray-300 cursor-pointer' onClick={() => dispatch(setSelectedUser(null))}>
                <IoMdArrowRoundBack className='text-gray-500  cursor-pointer' />
              </div>
              <img src={selectedUser?.image || dp} alt="profile" className='w-10 h-10 rounded-full object-cover' />
              <h1 className='text-lg font-semibold'>{selectedUser?.name || selectedUser?.username}</h1>
            </div>
          </div>

          <div className='bg-gray-300 flex-1 p-4 w-full overflow-y-auto pb-20'>
            <div className='flex flex-col gap-2'>
              {showpicker && (
                <div className='absolute bottom-20 left-4 z-50'>
                  <EmojiPicker onEmojiClick={handleEmojiClick} width={250} height={350} className='rounded-lg shadow-lg' />
                </div>
              )}
              {messages?.map((message) => (
                <div key={message._id}>
                  {message.sender === userData._id ? <SenderMessage image={message.image} message={message} /> : <RecieverMessage image={message.image} message={message} />}
                </div>
              ))}
              <div ref={lastMessageRef} />
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
        <>
          {frontendImage && (
            <div className="absolute bottom-24 right-5 z-10">
              <div className="relative">
                <img
                  src={frontendImage}
                  alt="preview"
                  className="w-[250px] rounded-lg shadow-lg object-cover max-h-[250px]"
                />
                <button
                  type="button"
                  onClick={() => {
                    setFrontendImage(null);
                    setBackendImage(null);
                  }}
                  className="absolute top-2 right-2 bg-black/60 text-white rounded-full w-6 h-6"
                >
                  ✕
                </button>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between px-4 py-2 border-t border-gray-300 bg-gray-800 border-opacity-20 shadow-md absolute bottom-0 w-full">
            <form
              className="flex items-center justify-between gap-2 w-full h-full px-4 py-2"
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
            >
              <div className='flex items-center justify-center w-10 h-10 rounded-full bg-gray-300 cursor-pointer' onClick={() => setShowpicker(!showpicker)}>
                <MdEmojiEmotions />
              </div>
              <input type="file" accept="image/*" hidden ref={image} onChange={(e) => {
                setFrontendImage(URL.createObjectURL(e.target.files[0]));
                setBackendImage(e.target.files[0]);
              }} />
              <input type="text" placeholder='Type a message...' className='w-full h-full bg-transparent outline-none text-white  placeholder-gray-400' value={inputMessage} onChange={(e) => setInputMessage(e.target.value)} />
              <div className='flex items-center justify-center w-10 h-10 rounded-full bg-gray-300 cursor-pointer' onClick={() => image.current.click()}>
                <FaImage />
              </div>
              {(inputMessage.length>0 || backendImage) && (
                <button className='flex items-center justify-center w-10 h-10 rounded-full bg-gray-300 cursor-pointer'>
                  <IoSend />
                </button>
              )}
            </form>
          </div>
        </>
      )}
    </div>
  )
}

export default MessageArea