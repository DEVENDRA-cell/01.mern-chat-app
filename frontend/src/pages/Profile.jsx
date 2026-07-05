import React from 'react'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { serverUrl } from '../config'
import { setUserData } from '../redux/userSlice'

import  { useEffect, useRef, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

function Profile() {

    const profileImg =
        "https://ui-avatars.com/api/?name=User&background=e5e7eb&color=6b7280&size=128";

    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    const { userData } = useSelector((state) => state.user);
    const dispatch = useDispatch();

    // Redirect if not logged in
    if (!userData) {
        return <Navigate to="/login" />;
    }

    const [name, setName] = useState(userData?.name || "");
    const [frontendImage, setFrontendImage] = useState(
        userData?.image || profileImg
    );
    const [backendImage, setBackendImage] = useState(null);

    console.log("Profile userData:", userData);

    // Update local state whenever Redux userData changes
    useEffect(() => {
        if (userData) {
            setName(userData.name || "");
            setFrontendImage(userData.image || profileImg);
        }
    }, [userData]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const formData = new FormData();

            formData.append("name", name);

            if (backendImage) {
                formData.append("profileimg", backendImage);
            }

            const { data } = await axios.put(
                serverUrl + "/api/user/profile",
                formData,
                {
                    withCredentials: true,
                }
            );

            dispatch(setUserData(data));

            if (data.user.image) {
                setFrontendImage(data.user.image);
            }

            navigate("/");
        } catch (error) {
            console.log("Error updating profile:", error);
            console.log(error.response?.data);
            console.log(error.response?.status);
        }
    };

    function handleFileClick(e) {
        const file = e.target.files[0];

        if (!file) return;

        setBackendImage(file);

        const image = URL.createObjectURL(file);
        setFrontendImage(image);
    } 
  return (
    <div className='w-full h-screen flex items-center justify-center bg-gray-300'>
        <div className='w-[400px] p-4 bg-white rounded-lg flex flex-col gap-4' >
                <form className="max-w-md mx-auto mt-8 p-6 bg-white rounded shadow" onSubmit={handleSubmit}>
                    <input type='file'  hidden ref={fileInputRef} onChange={handleFileClick} />
                <div className='w-32 h-32 mx-auto relative cursor-pointer' onClick={() => {fileInputRef.current.click()}}>
                    <img    src={frontendImage} alt='Profile Picture' className='w-full h-full    object-cover rounded' />
                    <div className='absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-50 transition-opacity ' >
                        <span className='text-white text-sm'>Change</span>
                    </div>
                </div>      
                <input type="text" placeholder="Enter your Name" className="w-full p-2 border border-gray-300 rounded mb-4" value={name} onChange={(e) => setName(e.target.value)} />
                <input type="text" placeholder="Username" className="w-full p-2 border border-gray-300 rounded mb-4" value={userData?.username} readOnly/>
                <input type="email" placeholder="Email" className="w-full p-2 border border-gray-300 rounded mb-4 " value={userData?.email} readOnly/>
                <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600" >
                    Update Profile
                </button>
            </form>
        <div className="fixed bottom-4 right-4 cursor-pointer" onClick={() => navigate('/')}>
            <a className="text-sm bg-gray-100 px-3 py-1 rounded hover:bg-gray-200">Go to Home</a>
        </div>
        </div>
        </div>
  )
}
export default Profile