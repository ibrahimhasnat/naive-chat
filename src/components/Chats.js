import React, { useContext, useEffect, useState } from 'react'
import { doc, onSnapshot } from 'firebase/firestore'

import { db } from '../firebase'
import { AuthContext } from '../context/authContext'
import { ChatContext } from '../context/chatContext'

const Chats = () => {

  const [chats, setChats] = useState([])
  const { currentUser } = useContext(AuthContext)
  const { dispatch } = useContext(ChatContext)

  useEffect(() => {

    if (currentUser.uid) {
      const unsub = onSnapshot(doc(db, 'chatList', currentUser.uid), (doc) => {
        setChats(doc.data())
      })
  
      return () => {
        return unsub()
      }      
    }

  }, [currentUser.uid])


  const handleSelect = (user) => {
    dispatch({ type: 'CHANGE_USER', payload: user })
  }

  return (
    <div className='chats'>
      
     {!Object.entries(chats).length && (
      <h4>No Users</h4>
     )}

      {chats && (
        Object.entries(chats)?.sort((a, b) => b[1].date - a[1].date).map((chat) => {
          return (
            <div className='user-box' key={chat[0]} onClick={() => handleSelect(chat[1].userInfo)}>
              <img src={chat[1].userInfo.photoURL} alt={chat[1].displayName} />

              <div className='user-info'>
                <h5>{chat[1].userInfo.displayName}</h5>
                <p>{chat[1].lastMessage?.text}</p>
              </div>
            </div>
          )
        })      
      )}            

    </div>
  )
}

export default Chats