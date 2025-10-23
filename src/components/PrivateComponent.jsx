'use client'
import { useRouter } from 'next/navigation'
import { useContext, useEffect } from 'react'
import UserContext from '../context/UserContext'
import AuthModalContext from '../context/AuthModalContext'
import { Spinner } from 'react-bootstrap'

export default function PrivateComponent({ children, redirectTo }) {
  const [user, userDispatch] = useContext(UserContext)
  const [authModal, authModalDispatch] = useContext(AuthModalContext)

  const router = useRouter()

  useEffect(() => {
    if (!user) {
      // If user is not logged in, redirect to home page and show login modal
      router.push(`/?auth=login&redirect=${redirectTo}`)
      authModalDispatch({ type: 'SHOW_LOGIN_MODAL' })
    }
  }, [])

  if (!user) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <Spinner
          as="span"
          animation="grow"
          size="lg"
          role="status"
          aria-hidden="true"
          variant="primary"
        />
        <Spinner
          as="span"
          animation="grow"
          size="lg"
          role="status"
          aria-hidden="true"
          variant="primary"
          className="ms-1"
        />
        <Spinner
          as="span"
          animation="grow"
          size="lg"
          role="status"
          aria-hidden="true"
          variant="primary"
          className="ms-1"
        />
      </div>
    )
  }

  return children
}
