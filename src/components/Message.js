import React, { useContext, useEffect, useRef } from 'react'
import { AuthContext } from '../context/authContext'
import { ChatContext } from '../context/chatContext'

const Message = ({ message }) => {

  const { currentUser } = useContext(AuthContext)
  const { data } = useContext(ChatContext)

  const ref = useRef()

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: 'smooth' })
  }, [message])

  return (
    <div ref={ref} className={`message ${currentUser.uid === message.senderID && 'self'}`}>
      <div className='meta'>
        <img src={message.senderID === currentUser.uid ? currentUser.photoURL : data.user.photoURL} alt='' />
        <span>{new Date(message.date.toDate()).toDateString()}</span>
      </div>
      <div className='content'>
        <p>{message.text}</p>
        {message?.img && <img src={message.img} alt='' />}
      </div>
    </div>
  )
}

export default Message