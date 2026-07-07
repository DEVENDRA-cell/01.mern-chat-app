import React from 'react'
import Sidebar from '../components/Sidebar'
import MessageArea from '../components/MessageArea'
import getMessages from '../customHooks/getMessages';

function Home() {
  getMessages();
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