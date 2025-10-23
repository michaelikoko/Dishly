'use client'

import { useContext, useState } from 'react'
import { bookmarkRecipe, unbookmarkRecipe } from '../actions/recipes'
import { Toast } from 'react-bootstrap'
import AuthModalContext from '../context/AuthModalContext'
import UserContext from '../context/UserContext'

export default function RecipeDetails({ recipe }) {
  const [authModal, authModalDispatch] = useContext(AuthModalContext)
  const [user, userDispatch] = useContext(UserContext)
  const [isRecipeBookmarked, setIsRecipeBookmarked] = useState(
    recipe.isBookmarked
  )
  const [showToast, setShowToast] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const handleBookmarkToggle = async () => {
    // Here you would typically make an API call to bookmark/unbookmark the recipe
    if (!user) {
      // If user is not logged in, show the auth modal
      authModalDispatch({ type: 'SHOW_LOGIN_MODAL' })
      return
    }
    try {
      if (isRecipeBookmarked) {
        // Call function to unbookmark recipe
        await unbookmarkRecipe({ slug: recipe.slug })
        setIsRecipeBookmarked(false) // Set the state to false
      } else {
        // Call function to bookmark recipe
        await bookmarkRecipe({ slug: recipe.slug })
        setIsRecipeBookmarked(true) // Set the state to false
      }
      setShowToast(false)
      setErrorMessage('')
    } catch (error) {
      setShowToast(true)
      setErrorMessage('Unable to save recipe')
    }
  }

  return (
    <div className="px-0 container-fluid min-vh-100 bg-light pb-5">
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
      <img
        src={recipe.imageUrl ? recipe.imageUrl : '/recipe-book.jpg'}
        className="w-100 img-fluid ratio ratio-21x9 object-fit-cover shadow-sm"
        alt=""
        style={{ height: '45vh' }}
      />

      <div className="container pt-5 px-5">
        <div className="d-flex flex-column align-items-start justify-content-center">
          <div className="fw-bold h1">{recipe.title}</div>
          <div className="fs-6 text-muted mt-1 text-start">
            {recipe.description}
          </div>
          <div className="w-100  d-flex flex-row align-items-center justify-content-start py-1 px-0 mt-3 rounded-pill">
            {recipe.tags.map((tag) => (
              <span
                key={tag._id}
                className="badge rounded-pill bg-secondary me-1 small"
              >
                {tag.name}
              </span>
            ))}
          </div>
          <div className="my-2 w-100 py-1 px-0 d-flex flex-row align-items-center justify-content-start">
            <div className="d-flex flex-row align-items-center justify-content-start">
              <i className="p-0 bi bi-clock-fill text-primary me-1 fs-6"></i>
              <span className="fs-6">{recipe.preparationTime} mins</span>
            </div>
            <div className="d-flex flex-row align-items-center justify-content-start ms-4">
              <span className="fw-bold fs-6">By: </span>
              <span className="ms-1 fs-6 text-muted">
                {recipe.creator.displayName}
              </span>
            </div>
            <div className="d-flex flex-row align-items-center justify-content-start ms-4">
              <div>
                <i
                  className={`btn btn-outline-primary border-0 ms-2 bi ${
                    isRecipeBookmarked ? 'bi-bookmark-fill' : 'bi-bookmark'
                  } text-small`}
                  onClick={handleBookmarkToggle}
                ></i>
              </div>
              <div>
                <i className="btn btn-outline-primary border-0 ms-2 bi bi-share-fill text-small"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container px-5 py-4">
        <div className="card border-0 shadow-lg">
          <div className="card-body">
            <div className="card-title h5 d-flex flex-row align-items-center justify-content-start">
              <i className="bi bi-list-ul me-2 text-primary"></i>
              <span className="fw-bold">Ingredients</span>
            </div>
            <ul className="bullet-primary px-4">
              {recipe.ingredients.map((ing, index) => {
                return (
                  <li key={index} className="p-2">
                    {ing}
                  </li>
                )
              })}
            </ul>
          </div>
        </div>

        <div className="card border-0 shadow-lg my-5">
          <div className="card-body">
            <div className="card-title h5 d-flex flex-row align-items-center justify-content-start">
              <i className="bi bi-list-ol me-2 text-primary"></i>
              <span className="fw-bold">Instructions</span>
            </div>
            <div className="">
              {recipe.steps.map((step, index) => {
                return (
                  <div
                    key={index}
                    className="px-2 py-4 bg-light bg-opacity-25 rounded my-2"
                  >
                    <span className="badge text-white bg-primary rounded-circle me-2">
                      {index + 1}
                    </span>
                    {step}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
