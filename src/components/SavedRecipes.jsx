'use client'
import { Button, Modal, Spinner, Toast } from 'react-bootstrap'
import RecipeCard from './RecipeCard'
import { useState } from 'react'
import { clearBookmarkedRecipes } from '../actions/recipes'

export default function SavedRecipes({ savedRecipes }) {
  const [showClearBookmarksModal, setShowClearBookmarksModal] = useState(false)
  const handleShowClearBookmarksModal = () => setShowClearBookmarksModal(true)
  const handleCloseClearBookmarksModal = () => setShowClearBookmarksModal(false)
  const [clearBookmarksButtonLoading, setClearBookmarksButtonLoading] =
    useState(false)

  const [showToast, setShowToast] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const clearBookmarks = async () => {
    setClearBookmarksButtonLoading(true)
    try {
      await clearBookmarkedRecipes()
      window.location.reload() // Hard reload
    }catch (error) {
      setErrorMessage('Error clearing bookmarks')
      setShowToast(true)
    } finally {
      setClearBookmarksButtonLoading(false)
      handleCloseClearBookmarksModal
    }
  }

  return (
    <>
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
      <Modal
        show={showClearBookmarksModal}
        onHide={handleCloseClearBookmarksModal}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header className="border-0" closeButton>
          <Modal.Title>Clear Bookmarks?</Modal.Title>
        </Modal.Header>
        <Modal.Body className="border-0">
          Are you sure you want to delete all saved recipes?
        </Modal.Body>
        <Modal.Footer className="border-0">
          <Button
            variant="secondary"
            className="text-white"
            onClick={handleCloseClearBookmarksModal}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            className="text-white"
            onClick={clearBookmarks}
          >
            {clearBookmarksButtonLoading && (
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
            Delete Bookmarks
          </Button>
        </Modal.Footer>
      </Modal>

      <div className="container-fluid bg-light py-2 pb-5">
        <div className="min-vh-100 container py-4">
          <div className="d-flex flex-row justify-content-between align-items-center row">
            <div className="d-flex flex-column justify-content-center align-items-start col-12 col-sm-8 col-lg-10">
              <span className="fs-3 fw-bolder">Saved Recipes</span>
              <span className="text-muted small">
                Visit your collection of favorite recipes
              </span>
            </div>
            <div
              className="btn btn-primary col-12 col-sm-4 col-lg-2"
              onClick={handleShowClearBookmarksModal}
            ><i className="bi bi-trash text-white me-1"></i>
              <span className="small text-white fw-bold">
                Clear Bookmarks
              </span>
            </div>
          </div>
          <div className="row py-4">
            <div className="col-sm-6 col-12">
              <div className="card bg-white">
                <div className="card-body d-flex flex-row align-items-center justify-content-between ">
                  <div className="d-flex flex-column justify-content-center align-items-start">
                    <span className="text-muted fs-6 fw-medium">
                      Total Saves
                    </span>
                    <span className="fw-bolder fs-4">
                      {savedRecipes.length}
                    </span>
                  </div>
                  <div className="bg-primary bg-opacity-10 p-2 rounded">
                    <i className="bi bi-bookmark-fill fs-3 text-primary"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row g-3 p-0">
            {savedRecipes.map((recipe) => (
              <div className="col-md-3 col-12" key={recipe._id}>
                <RecipeCard recipe={recipe} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
