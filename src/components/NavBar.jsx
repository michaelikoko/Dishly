'use client'

import {
  Navbar,
  Container,
  Button,
  Offcanvas,
  Form,
  InputGroup,
  Dropdown,
} from 'react-bootstrap'
import Image from 'next/image'
import { useContext, useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { usePathname } from 'next/navigation'
import LoginModal from './LoginModal'
import RegisterModal from './RegisterModal'
import AuthModalContext from '../context/AuthModalContext'
import UserContext from '../context/UserContext'
import { deleteSession } from '../lib/session'

export function Logo() {
  return (
    <Navbar.Brand className="d-flex flex-row align-items-center justify-content-center ms-2">
      <Link
        href="/"
        className="text-decoration-none d-flex flex-row align-items-center justify-content-start"
      >
        <Image
          src="/logo.png"
          alt="Picture of the Dishly Logo"
          width={35}
          height={35}
          className="img-fluid"
        />
        <span className="text-dark fw-bold ms-2 d-none d-sm-flex">Dishly</span>
      </Link>
    </Navbar.Brand>
  )
}

function NavBar() {
  const searchParams = useSearchParams()
  const search = searchParams.get('search') // Get the search query from URL parameters
  const [searchQuery, setSearchQuery] = useState(search || '') // State to hold search query
  const [authModal, authModalDispatch] = useContext(AuthModalContext)
  const [user, userDispatch] = useContext(UserContext)

  const [showOffcanvas, setShowOffcanvas] = useState(false)
  const handleShowOffcanvas = () => setShowOffcanvas(true)
  const handleCloseOffcanvas = () => setShowOffcanvas(false)

  const pathname = usePathname() // Get the current path
  const router = useRouter() // Initialize the router

  const route = (path) => {
    if (pathname === path) return // Do nothing if already on the route
    router.push(path) // Navigate to the route
    handleCloseOffcanvas() // Close the offcanvas after navigation
  }
  //console.log(pathname)

  async function logout() {
    await deleteSession()
    window.location.reload()
  }

  useEffect(() => {
    setSearchQuery(search || '') //
  }, [search])

  return (
    <>
      <LoginModal />
      <RegisterModal />
      <Offcanvas show={showOffcanvas} onHide={setShowOffcanvas}>
        <Offcanvas.Header
          className="bg-white border border-bottom border-opacity-25 shadow-sm w-100"
          closeButton
        >
          <Offcanvas.Title>
            <Logo />
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className="p-4">
          <ul className="navbar-nav justify-content-end flex-grow-1 pe-3">
            <li className="nav-item mb-2">
              <div
                className={`btn btn-outline-light w-100 border border-0 d-flex flex-row align-items-center justify-content-start p-2 ${
                  pathname === '/' && 'bg-primary bg-opacity-25 disabled'
                }`}
                aria-current="page"
                onClick={() => route('/')}
              >
                <i className="bi bi-house me-3 text-secondary"></i>
                <span className="text-dark">Home</span>
              </div>
            </li>

            <li className="nav-item mb-2">
              <div
                className={`btn btn-outline-light w-100 border border-0 d-flex flex-row align-items-center justify-content-start p-2 ${
                  pathname === '/recipes' && 'bg-primary bg-opacity-25 disabled'
                }`}
                aria-current="page"
                onClick={() => route('/recipes')}
              >
                <i className="bi bi-journal-text me-3 text-secondary"></i>
                <span className="text-dark">All Recipes</span>
              </div>
            </li>

            <li className="nav-item mb-2">
              <div
                aria-current="page"
                className={`btn btn-outline-light w-100 border border-0 d-flex flex-row align-items-center justify-content-start p-2 ${
                  pathname === '/recipes/ai' &&
                  'bg-primary bg-opacity-25 disabled'
                }`}
                onClick={() => route('/recipes/ai')}
              >
                <i className="bi bi-stars me-3 text-secondary"></i>
                <span className="text-dark">Generate Recipe with AI</span>
              </div>
            </li>

            <li className="nav-item mb-2">
              <div
                className={`btn btn-outline-light w-100 border border-0 d-flex flex-row align-items-center justify-content-start p-2 ${
                  pathname === '/my-recipes' &&
                  'bg-primary bg-opacity-25 disabled'
                }`}
                aria-current="page"
                onClick={() => route('/my-recipes')}
              >
                <i className="bi bi-collection me-3 text-secondary"></i>
                <span className="text-dark">My Recipes</span>
              </div>
            </li>

            <li className="nav-item mb-2">
              <div
                className={`btn btn-outline-light w-100 border border-0 d-flex flex-row align-items-center justify-content-start p-2 ${
                  pathname === '/saved-recipes' &&
                  'bg-primary bg-opacity-25 disabled'
                }`}
                aria-current="page"
                onClick={() => route('/saved-recipes')}
              >
                <i className="bi bi-bookmark me-3 text-secondary"></i>
                <span className="text-dark">Saved Recipes</span>
              </div>
            </li>

            {user && (
              <>
                <div className="border border-top border-opacity-10 my-3"></div>

                <li className="nav-item mt-2">
                  <div
                    className="btn btn-outline-light w-100 border border-0 d-flex flex-row align-items-center justify-content-start p-2 "
                    aria-current="page"
                    onClick={logout}
                  >
                    <i className="bi bi-box-arrow-right fw-bold me-3 text-primary"></i>
                    <span className="text-dark">Logout</span>
                  </div>
                </li>
              </>
            )}
          </ul>
        </Offcanvas.Body>
      </Offcanvas>

      <Navbar
        className="bg-white border border-bottom border-opacity-25 shadow-sm"
        variant="dark"
        sticky="top"
      >
        <Container>
          <div className="row w-100">
            <div className="d-flex flex-row align-items-center justify-content-start col-md-4 col-4 p-0">
              <Button
                variant="outline-light"
                onClick={handleShowOffcanvas}
                className="border border-0"
              >
                <i className="bi bi-list fw-bolder text-dark fs-3"></i>
              </Button>
              <Logo />
            </div>

            <Form
              onSubmit={(e) => {
                e.preventDefault()
                window.location.href = `/recipes?search=${encodeURIComponent(
                  searchQuery
                )}`
                //router.push(
                //</div>  `/recipes?search=${encodeURIComponent(searchQuery)}`
                //)
                //setSearchQuery('')
              }}
              className="col-md-4 col-12 d-none d-md-flex d-flex flex-row align-items-center justify-content-center align-items-center"
            >
              <InputGroup>
                <InputGroup.Text
                  id="basic-addon1"
                  className="rounded-5 rounded-end"
                >
                  <i className="bi bi-search"></i>
                </InputGroup.Text>
                <Form.Control
                  placeholder="Search Recipes"
                  aria-label="Search"
                  aria-describedby="basic-addon1"
                  className="rounded-start rounded-5"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </InputGroup>
            </Form>

            {user ? (
              <div className="col-md-4 col-8 p-0 d-flex flex-row align-items-center justify-content-end ">
                <Dropdown>
                  <Dropdown.Toggle
                    variant="white"
                    id="dropdown-basic"
                    className="p-1 border-0"
                  >
                    <i className="bi bi-person-circle fs-2 p-0 btn btn-outline-primary border-0 bg-white"></i>
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={logout}>Logout</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
                <div className="d-flex flex-column align-items-start justify-content-center ms-1">
                  <span className="fs-6 fw-medium">{user.displayName}</span>
                  <span className="small text-muted">{user.email}</span>
                </div>
              </div>
            ) : (
              <div className="d-flex flex-row align-items-center justify-content-end col-md-4 col-8 p-0">
                <div
                  className="hover link-primary px-0 me-3 link-offset-2 link-offset-3-hover link-underline link-underline-opacity-0 link-underline-opacity-75-hover fw-bold"
                  onClick={() =>
                    authModalDispatch({ type: 'SHOW_LOGIN_MODAL' })
                  }
                >
                  Sign In
                </div>
                <Button
                  variant="primary"
                  className="rounded-pill text-white"
                  onClick={() => {
                    authModalDispatch({ type: 'SHOW_REGISTER_MODAL' })
                  }}
                >
                  Sign Up
                </Button>
              </div>
            )}
          </div>
        </Container>
      </Navbar>
    </>
  )
}

export default NavBar

/*            <li className="nav-item mb-2">
              <div
                className="btn btn-outline-light w-100 border border-0 d-flex flex-row align-items-center justify-content-start p-2 "
                aria-current="page"
                href="#"
              >
                <i className="bi bi-plus-circle me-3 text-secondary"></i>
                <span className="text-dark">Create Recipe</span>
              </div>
            </li>*/
