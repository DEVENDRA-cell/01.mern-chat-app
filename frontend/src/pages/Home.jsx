import React from 'react'
import Sidebar from '../components/Sidebar'
import MessageArea from '../components/MessageArea'

function Home() {
  return (
    <>
      <div className="flex h-screen overflow-hidden ">
        <Sidebar />
        <MessageArea />
      </div>
    </>
  )
}

export default Home