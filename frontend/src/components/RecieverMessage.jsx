import React from 'react'
import dp from '../assets/dp.png'
function RecieverMessage() {
  return (
    <div className='flex items-start justify-start  bg-blue-100 mb-2 rounded-lg text-black p-2 w-fit max-w-[70%] mr-auto border border-gray-400 '>
        <img src={dp} alt="profile" className='w-8 h-8 rounded-full object-cover' />
        Hiii
    </div>
  )
}

export default RecieverMessage