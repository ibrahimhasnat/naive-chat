import React, { useContext } from 'react'
import { Toaster } from 'react-hot-toast';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import './main.css'
import Register from './pages/Register'
import Login from './pages/Login'
import ChatContainer from './pages/ChatContainer'

import { AuthContext } from './context/authContext'


const App = () => {

  const { currentUser } = useContext(AuthContext)

  const ProtectedRoute = () => {

    if (!currentUser) {
      return <Navigate to='/login' />
    } else {
      return <ChatContainer />
    }

  }

  return (
    <>
      <Toaster />
        <BrowserRouter>
          <Routes>
            <Route path='/'>
              <Route index element={<ProtectedRoute />} />
              <Route path='login' element={<Login />} />
              <Route path='register' element={<Register />} />
            </Route>
          </Routes>
        </BrowserRouter>
    </>
  )
}

export default App