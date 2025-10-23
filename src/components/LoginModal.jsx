'use client'

import { Button, Form, Modal, Spinner, Toast } from 'react-bootstrap'
import { useContext, useEffect, useState } from 'react'
import AuthModalContext from '../context/AuthModalContext'
import UserContext from '../context/UserContext'
import { Logo } from './NavBar'
import { signIn } from '../actions/auth'
import { useRouter, useSearchParams } from 'next/navigation'

export default function LoginModal() {
  const [authModal, authModalDispatch] = useContext(AuthModalContext)
  const [user, userDispatch] = useContext(UserContext)

  const [showToast, setShowToast] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [loginButtonLoading, setLoginButtonLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [seePassword, setSeePassword] = useState(false)
  const toggleSeePassword = () => setSeePassword(!seePassword)

  const searchParams = useSearchParams()
  const authParams = searchParams.get('auth') // Tells the page to show the login modal
  const redirectParams = searchParams.get('redirect') // The page to redirect to after successful login

  useEffect(() => {
    if (authParams === 'login') {
      authModalDispatch({ type: 'SHOW_LOGIN_MODAL' })
    }
  }, [])

  const clearFields = () => {
    setEmail('')
    setPassword('')
    setSeePassword(false)
    setErrorMessage('')
    setShowToast(false)
    setLoginButtonLoading(false)
  }

  async function login(event) {
    event.preventDefault()

    setLoginButtonLoading(true)
    try {
      await signIn({ email, password })
      setEmail('')
      setPassword('')
      setErrorMessage('')

      if (redirectParams) {
        // Navigate to the redirect page
        clearFields()
        authModalDispatch({ type: 'CLOSE_AUTH_MODAL' })
        window.location.href = `/${redirectParams}` // Hard redirect
      } else {
        // Refresh the page
        window.location.reload() // Hard reload
      }
    } catch (error) {
      if (error.status === 401) {
        setErrorMessage('Invalid email or password')
        setShowToast(true)
      } else {
        setErrorMessage('An error occurred')
        setShowToast(true)
      }
    } finally {
      setLoginButtonLoading(false)
    }
  }

  return (
    <Modal
      show={authModal.showLoginModal}
      onHide={() => {
        clearFields()
        authModalDispatch({ type: 'CLOSE_AUTH_MODAL' })
      }}
      centered
    >
      <Toast
        onClose={() => setShowToast(false)}
        show={showToast}
        delay={3000}
        autohide
        className="fixed-top p-0"
        bg="primary"
      >
        <Toast.Header className="d-flex flex-row justify-content-end align-items-center ">
          <span className="strong me-auto">Error!</span>
        </Toast.Header>
        <Toast.Body className="text-white">{errorMessage}</Toast.Body>
      </Toast>
      <Modal.Body className="container px-5 py-4">
        <div className="d-flex flex-column align-items-center justify-content-center">
          <Logo />
          <div className="fw-bolder fs-5 py-1">Welcome back!</div>
          <div className="text-muted small py-1 text-center">
            Sign in to your account to continue cooking
          </div>
        </div>
        <Form className="mt-3" onSubmit={login}>
          <Form.Group className="mt-4">
            <Form.Label className="fw-bold text-muted">
              Email address
            </Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter your email"
              autoFocus
              required
              minLength={5}
              maxLength={50}
              onChange={(event) => setEmail(event.target.value)}
              value={email}
            />
          </Form.Group>
          <Form.Group className="mt-4">
            <Form.Label className="fw-bold text-muted">Password</Form.Label>
            <div className="d-flex flex-row align-items-center justify-content-center">
              <Form.Control
                type={seePassword ? 'text' : 'password'}
                placeholder="Enter your password"
                required
                minLength={6}
                maxLength={50}
                onChange={(event) => setPassword(event.target.value)}
                value={password}
              />
              <Button
                variant="outline- border border-light"
                className=""
                onClick={toggleSeePassword}
              >
                {seePassword ? (
                  <i className="bi bi-eye-slash text-primary fw-bold"></i>
                ) : (
                  <i className="bi bi-eye text-primary fw-bold"></i>
                )}
              </Button>
            </div>
          </Form.Group>
          <div className="my-3 w-100 d-flex flex-row align-items-center justify-content-end">
            <a href="/#" className="text-secondary text-decoration-none">
              Forgot password ?
            </a>
          </div>
          <button type="submit" className="btn btn-primary w-100 my-1">
            {loginButtonLoading && (
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
                variant="white"
                className="me-2"
              />
            )}
            <span className="text-white fw-bold">Sign In</span>
          </button>
        </Form>
      </Modal.Body>
    </Modal>
  )
}
