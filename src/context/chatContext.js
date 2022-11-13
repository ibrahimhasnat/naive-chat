import { createContext, useContext, useReducer } from 'react'

import { AuthContext } from './authContext'

export const ChatContext = createContext()

export const ChatContextProvider = ({ children }) => {

  const { currentUser } = useContext(AuthContext)

  const INITIAL_STATE = {
    chatID: 'null',
    user: {}
  }

  const chatReducer = (state, action) => {
    switch(action.type) {
      case 'CHANGE_USER':
        return {
          chatID: currentUser.uid > action.payload.uid ? currentUser.uid + action.payload.uid : action.payload.uid + currentUser.uid,
          user: action.payload
        }
      default:
        return state
    }
  }

  const [state, dispatch] = useReducer(chatReducer, INITIAL_STATE)

  return (
    <ChatContext.Provider value={{ data: state, dispatch }}>
      {children}
    </ChatContext.Provider>    
  )
}