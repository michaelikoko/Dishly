'use client'
import Link from 'next/link'
import { useState } from 'react'
import { Button, Modal, Spinner, Toast } from 'react-bootstrap'
import { deleteRecipeBySlug } from '../actions/recipes'

export default function RecipeCard({ recipe, showDelete }) {
  const [deleteButtonLoading, setDeleteButtonLoading] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const handleCloseModal = () => setShowConfirmModal(false)
  const handleShowModal = () => setShowConfirmModal(true)

  const deleteRecipe = async () => {
    setDeleteButtonLoading(true)
    try {
      await deleteRecipeBySlug({ slug: recipe.slug })
      window.location.reload() // Hard reload
    } catch (error) {
      setErrorMessage('Error deleting recipe')
      setShowToast(true)
    } finally {
      setDeleteButtonLoading(false)
      setShowConfirmModal(false)
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
        show={showConfirmModal}
        onHide={handleCloseModal}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header className="border-0" closeButton>
          <Modal.Title>Delete Recipe?</Modal.Title>
        </Modal.Header>
        <Modal.Body className="border-0">
          Are you sure you want to delete the recipe{' '}
          <span className="fw-bolder">&quot;{recipe.title}&quot;</span>?
        </Modal.Body>
        <Modal.Footer className="border-0">
          <Button
            variant="secondary"
            className="text-white"
            onClick={handleCloseModal}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            className="text-white"
            onClick={deleteRecipe}
          >
            {deleteButtonLoading && (
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
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

      <Link href={`/recipes/${recipe.slug}`} className="text-decoration-none">
        <div className="card shadow-lg recipe-card h-100 position-relative">
          <div className="position-relative">
            <img
              src={recipe.imageUrl ? recipe.imageUrl : '/recipe-book.jpg'}
              className="card-img-top recipe-card-img"
              alt={recipe.title + ' Image'}
            />

            {/* Delete icon overlay */}
            {showDelete && (
              <button
                type="button"
                className="delete-btn position-absolute"
                onClick={(e) => {
                  e.stopPropagation() // prevent link navigation
                  e.preventDefault()
                  handleShowModal()
                  //onDelete?.(recipe._id)
                }}
                aria-label="Delete Recipe"
              >
                <i className="bi bi-trash3-fill"></i>
              </button>
            )}
          </div>
          <div className="card-body recipe-card-body">
            <div className="d-flex flex-row align-items-center justify-content-start py-1">
              {recipe.tags.map((tag) => (
                <span
                  key={tag._id}
                  className="badge rounded-pill bg-secondary me-1 small"
                >
                  {tag.name}
                </span>
              ))}
            </div>
            <div className="card-title fw-bold fs-6">{recipe.title}</div>
            <div className="card-text small text-muted text-truncate">
              {recipe.description}
            </div>
          </div>
          <div className="card-footer border-0 bg-white">
            <div className="card-text small d-flex flex-row justify-content-between align-items-center mt-3">
              <span className="text-muted small">
                By {recipe.creator.displayName}
              </span>
              <span className="text-muted">
                <i className="bi bi-clock-fill text-muted me-1"></i>
                {recipe.preparationTime} mins
              </span>
            </div>
          </div>
        </div>
      </Link>
    </>
  )
}
