import React, { useContext, useEffect, useState } from 'react'
import { doc, onSnapshot } from 'firebase/firestore'

import { ChatContext } from '../context/chatContext'

import Message from './Message'
import { db } from '../firebase'

const Messages = () => {

  const [messages, setMessages] = useState([])
  const { data } = useContext(ChatContext)
  
  useEffect(() => {

    const unsub = onSnapshot(doc(db, 'chats', data.chatID), (doc) => {
      doc.exists() ? setMessages(doc.data().messages) : setMessages([])
    })

    return () => {
      unsub()
    }
    
  }, [data.chatID])

  return (
    <div className='messages'>

      {messages && (
        messages.map((message) => (
          <Message message={message} key={message.id} />
        ))        
      )}

    </div>
  )
}

export default Messages