import React from 'react'
import dp from '../assets/dp.png'
function SenderMessage() {
  return (
    <div className='flex items-end justify-end mb-2 rounded-lg bg-blue-500 text-white p-2 w-fit max-w-[70%] ml-auto'>
        <img src={dp} alt="profile" className='w-8 h-8 rounded-full object-cover' />
        Hiii
    </div>
  )
}

export default SenderMessage