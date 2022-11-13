import React, { useContext } from 'react'

import Chat from '../components/Chat'
import Sidebar from '../components/Sidebar'
import { ChatContext } from '../context/chatContext'

const ChatContainer = () => {

  const { data } = useContext(ChatContext)

  return (
    <div className='chat-container'>
      <div className='container'>

        <Sidebar />
        {Object.keys(data.user).length ? (
          <Chat />        
        ) : (
          <>
          </>
        )}

      </div>
    </div>
  )
}

export default ChatContainer