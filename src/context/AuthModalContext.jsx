'use client'
import { createContext, useReducer } from 'react'

const AuthModalContext = createContext()

const authModalReducer = (state, action) => {
  switch (action.type) {
  case 'SHOW_REGISTER_MODAL':
    return {
      showRegisterModal: true,
      showLoginModal: false,
    }
    break
  case 'SHOW_LOGIN_MODAL':
    return {
      showRegisterModal: false,
      showLoginModal: true,
    }
    break
  case 'CLOSE_AUTH_MODAL':
    return {
      showRegisterModal: false,
      showLoginModal: false,
    }
    break
  default:
    break
  }
}

export const AuthModalProvider = ({ children }) => {
  const initialState = {
    showLoginModal: false,
    showRegisterModal: false,
  }

  const [authModal, authModalDispatch] = useReducer(
    authModalReducer,
    initialState
  )

  return (
    <AuthModalContext.Provider value={[authModal, authModalDispatch]}>
      {children}
    </AuthModalContext.Provider>
  )
}

export default AuthModalContext
