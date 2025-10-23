'use client'
import { createContext, useReducer } from 'react'

const UserContext = createContext()

const userReducer = (state, action) => {
  switch (action.type) {
  case 'SET_USER':
    return action.payload
    break
  case 'DELETE_USER':
    return null
    break
  default:
    return state
    break
  }
}

export const UserProvider = ({ children, userInfo }) => {
  const [user, userDispatch] = useReducer(userReducer, userInfo)
  return (
    <UserContext.Provider value={[user, userDispatch]}>
      {children}
    </UserContext.Provider>
  )
}

export default UserContext
