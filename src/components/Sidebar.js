import React, { useContext } from 'react'
import { signOut } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'

import { auth } from '../firebase'
import { AuthContext } from '../context/authContext'

import Search from './Search'
import Chats from './Chats'
import { ChatContext } from '../context/chatContext'

const Sidebar = () => {

  const { currentUser } = useContext(AuthContext)
  const { dispatch } = useContext(ChatContext)
  const navigate = useNavigate()

  const logoutHandler = () => {
    const user = {}
    dispatch({ type: 'CHANGE_USER', payload: user })
    signOut(auth)
    navigate('/login')
  }

  return (
    <div className='sidebar'>
      <div className='sidebar-header'>
        <div className='brand-name'>
          <span>Naive Chat</span>
        </div>
        <div className='header-profile'>
          <img src={currentUser.photoURL} alt={currentUser.displayName} />
          <div>
            <h3>{currentUser.displayName}</h3>
            <button onClick={logoutHandler}>Logout</button>
          </div>
        </div>
      </div>

      <Search />
      <Chats />
    </div>
  )
}

export default Sidebar