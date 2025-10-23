import { Button, Form, Modal, Spinner, Toast } from 'react-bootstrap'
import AuthModalContext from '../context/AuthModalContext'
import { useContext, useState } from 'react'
import { Logo } from './NavBar'
import { signUp } from '../actions/auth'

export default function RegisterModal() {
  const [authModal, authModalDispatch] = useContext(AuthModalContext)

  const [showToast, setShowToast] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [registerButtonLoading, setRegisterButtonLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [seePassword, setSeePassword] = useState(false)
  const [seeConfirmPassword, setSeeConfirmPassword] = useState(false)
  const toggleSeePassword = () => setSeePassword(!seePassword)
  const toggleSeeConfirmPassword = () =>
    setSeeConfirmPassword(!seeConfirmPassword)

  const clearFields = () => {
    setEmail('')
    setDisplayName('')
    setPassword('')
    setConfirmPassword('')
    setSeePassword(false)
    setSeeConfirmPassword(false)
    setErrorMessage('')
    setShowToast(false)
    setRegisterButtonLoading(false)
  }

  async function register(event) {
    event.preventDefault()
    setRegisterButtonLoading(true)

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match')
      setShowToast(true)
      setRegisterButtonLoading(false)
      return
    }

    try {
      await signUp({ email, displayName, password, confirmPassword })
      setEmail('')
      setDisplayName('')
      setPassword('')
      setConfirmPassword('')
      setErrorMessage('')
      window.location.reload()
    } catch (error) {
      if (error.status === 400) {
        setErrorMessage('Invalid input')
        setShowToast(true)
      } else if (error.status === 409) {
        setErrorMessage('Email already in use')
        setShowToast(true)
      } else {
        setErrorMessage('An error occurred')
        setShowToast(true)
      }
    } finally {
      setRegisterButtonLoading(false)
    }
  }

  return (
    <Modal
      show={authModal.showRegisterModal}
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
          <div className="fw-bolder fs-5 py-1">Join our community!</div>
          <div className="text-muted small py-1 text-center">
            Join our community of food lovers and share your favorite recipes{' '}
          </div>
        </div>
        <Form className="mt-3" onSubmit={register}>
          <Form.Group className="mt-1">
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

          <Form.Group className="mt-3">
            <Form.Label className="fw-bold text-muted">Display name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Choose your display name"
              required
              minLength={2}
              maxLength={50}
              onChange={(event) => setDisplayName(event.target.value)}
              value={displayName}
            />
          </Form.Group>

          <Form.Group className="mt-3">
            <Form.Label className="fw-bold text-muted">Password</Form.Label>
            <div className="d-flex flex-row align-items-center justify-content-center">
              <Form.Control
                type={seePassword ? 'text' : 'password'}
                placeholder="Create a password"
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

          <Form.Group className="mt-3">
            <Form.Label className="fw-bold text-muted">
              Confirm Password
            </Form.Label>
            <div className="d-flex flex-row align-items-center justify-content-center">
              <Form.Control
                type={seeConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm your password"
                required
                minLength={6}
                maxLength={50}
                onChange={(event) => setConfirmPassword(event.target.value)}
                value={confirmPassword}
              />
              <Button
                variant="outline- border border-light"
                className=""
                onClick={toggleSeeConfirmPassword}
              >
                {seeConfirmPassword ? (
                  <i className="bi bi-eye-slash text-primary fw-bold"></i>
                ) : (
                  <i className="bi bi-eye text-primary fw-bold"></i>
                )}
              </Button>
            </div>
          </Form.Group>

          <button type="submit" className="btn btn-primary w-100 my-4">
            {registerButtonLoading && (
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
            <span className="text-white fw-bold">Create Account</span>
          </button>
        </Form>
      </Modal.Body>{' '}
    </Modal>
  )
}
