import React, { useContext, useState } from 'react'

import Messages from './Messages'
import Input from './Input'
import Profile from './Profile'
import { ChatContext } from '../context/chatContext'

const Chat = () => {

  const [isShowProfile, setIsShowProfile] = useState(false)

  const { data } = useContext(ChatContext)
  const viewProfile = () => {
    setIsShowProfile((prev) => !prev)
  }

  return (
    <div className='chat'>
      
      <div className='chat-header'>
        <div className='header-left'>
          <h4>{data.user?.displayName}</h4>
        </div>
        <div className='header-right'>
          <button onClick={viewProfile}>{isShowProfile ? 'View Conversation' : 'View Profile'}</button>
        </div>
      </div>



      {isShowProfile ? (
        <Profile user={data.user} />
      ) : (
        <>
          <Messages />
          <Input />           
        </>
      )}

    </div>
  )
}

export default Chat