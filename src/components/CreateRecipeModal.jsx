'use client'
import { useState } from 'react'
import { Form, Modal, Spinner, Toast } from 'react-bootstrap'
import Select from 'react-select'
import { createRecipe } from '../actions/recipes'

export default function CreateRecipeModal({ show, onClose, allTags }) {
  const [createButtonLoading, setCreateButtonLoading] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [preparationTime, setPreparationTime] = useState(1)
  const [ingredients, setIngredients] = useState(['']) // State to save the list of ingredients
  const [steps, setSteps] = useState(['']) // State to save the list of ingredients
  const [tags, setTags] = useState([])
  const [imageFile, setImageFile] = useState(null)

  const handleFileChange = (event) => {
    setImageFile(event.target.files[0])
  }

  const handleChangeTags = (e) => {
    setTags(e.map((t) => t.value))
  }
  const handleIngredientChange = (event, index) => {
    const newIngredientsList = [...ingredients]
    newIngredientsList[index] = event.target.value
    setIngredients(newIngredientsList)
  }

  const addIngredient = () => {
    // Function to add a text field for new ingredient

    setIngredients((prevIngredients) => {
      return [...prevIngredients, '']
    })
  }

  const removeIngredient = (index) => {
    // Removes the ingredient from the array at the given index
    if (ingredients.length === 1) {
      setIngredients(['']) // Clear the text in the last remaining ingredient
      return
    } // Ensure at least a text field is always rendered
    const newIngredientList = [
      ...ingredients.slice(0, index),
      ...ingredients.slice(index + 1),
    ]
    setIngredients(newIngredientList)
  }

  const handleStepChange = (event, index) => {
    const newStepsList = [...steps]
    newStepsList[index] = event.target.value
    setSteps(newStepsList)
  }

  const addStep = () => {
    // Function to add a text field for new step

    setSteps((prevSteps) => {
      return [...prevSteps, '']
    })
  }

  const removeStep = (index) => {
    // Removes the step from the array at the given index
    if (steps.length === 1) {
      setSteps(['']) // Clear the text in the last remaining step
      return
    } // Ensure at least a text field is always rendered
    const newStepsList = [...steps.slice(0, index), ...steps.slice(index + 1)]
    setSteps(newStepsList)
  }

  const clearFields = () => {
    setShowToast(false)
    setErrorMessage('')
    setTitle('')
    setDescription('')
    setPreparationTime(0)
    setIngredients([''])
    setSteps([''])
    setTags([])
  }

  const handleCreateRecipe = async (event) => {
    event.preventDefault()
    setCreateButtonLoading(true)
    try {
      const formData = new FormData()
      if (imageFile) {
        if (
          imageFile.type !== 'image/png' &&
          imageFile.type !== 'image/jpeg' &&
          imageFile.type !== 'image/webp'
        ) {
          setErrorMessage('Only PNG, JPEG, and WEBP images are allowed')
          setShowToast(true)
          setCreateButtonLoading(false)
          return
        }
        if (imageFile.size > 1 * 1024 * 1024) {
          setErrorMessage('Image size should be less than 1MB')
          setShowToast(true)
          setCreateButtonLoading(false)
          return
        }

        formData.append('image', imageFile)
      }
      formData.append('title', title)
      formData.append('description', description)
      formData.append('preparationTime', preparationTime)
      tags.forEach((tag, index) => {
        formData.append(`tags[${index}]`, tag)
      })
      steps.forEach((step, index) => {
        formData.append(`steps[${index}]`, step)
      })
      ingredients.forEach((ingredient, index) => {
        formData.append(`ingredients[${index}]`, ingredient)
      })
      await createRecipe(formData)
      clearFields()
      window.location.reload() // Hard reload
    } catch (error) {
      //console.log('error', error)
      setErrorMessage('Error creating recipe')
      setShowToast(true)
    } finally {
      setCreateButtonLoading(false)
    }
  }

  let tagOptions = []
  if (allTags) {
    tagOptions = allTags.map((t) => {
      return {
        label: t.name,
        value: t.slug,
      }
    })
  }

  return (
    <Modal show={show} onHide={onClose} fullscreen={true}>
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
      <Modal.Header className="border-0" closeButton>
        <Modal.Title className="d-flex flex-column align-items-start justify-content-center container">
          <span className="fw-bold">Create New Recipe</span>
          <span className="text-muted fs-6">
            Share your culinary creations with the world
          </span>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-0 container-fluid">
        <Form className="container p-0" onSubmit={handleCreateRecipe}>
          <Form.Group className="">
            <Form.Label className="fw-bold text-muted">Title</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter recipe title"
              autoFocus
              minLength={2}
              maxLength={100}
              required
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
          </Form.Group>
          <Form.Group className="mt-3">
            <Form.Label className="fw-bold text-muted">Recipe Image</Form.Label>
            <Form.Control
              type="file"
              onChange={handleFileChange}
              accept=".png, .jpeg, .png, .webp"
              required
            />
          </Form.Group>
          <Form.Group className="mt-3">
            <Form.Label className="fw-bold text-muted">Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Enter a brief description of the recipe"
              required
              minLength={10}
              maxLength={1000}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />
          </Form.Group>
          <Form.Group className="mt-3">
            <Form.Label className="fw-bold text-muted">
              Preparation Time (mins)
            </Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter preparation time in minutes"
              required
              min={1}
              value={preparationTime}
              onChange={(event) => setPreparationTime(event.target.value)}
            />
          </Form.Group>
          <Form.Group className="mt-3">
            <Form.Label className="fw-bold text-muted">Select Tags</Form.Label>
            <Select
              isMulti
              name="tags"
              options={tagOptions}
              className="basic-multi-select w-100"
              classNamePrefix="select"
              isSearchable={true}
              instanceId="tags-select"
              onChange={handleChangeTags}
              isClearable={true}
            />
          </Form.Group>
          <Form.Group className="mt-3">
            <Form.Label className="fw-bold text-muted">Ingredients</Form.Label>

            {ingredients.map((ingredient, index) => (
              <div
                className="d-flex flex-row align-items-center justify-content-start my-1"
                key={index}
              >
                <span className="badge text-white bg-primary rounded-circle me-2">
                  {index + 1}
                </span>
                <Form.Control
                  type="text"
                  placeholder="Enter ingredient e.g tomatoes"
                  value={ingredient}
                  onChange={(event) => handleIngredientChange(event, index)}
                  required
                />
                <div
                  className="btn btn-outline-danger border-0"
                  onClick={() => removeIngredient(index)}
                >
                  <i className="bi bi-x-circle"></i>
                </div>
              </div>
            ))}

            <div className="d-flex flex-row align-items-center justify-content-center py-2 w-100">
              <div
                className="btn btn-outline-secondary border-0"
                onClick={addIngredient}
              >
                <span className="fw-bold">+ Add Ingredient</span>
              </div>
            </div>
          </Form.Group>

          <Form.Group className="mt-3">
            <Form.Label className="fw-bold text-muted">Steps</Form.Label>

            {steps.map((step, index) => (
              <div
                className="d-flex flex-row align-items-center justify-content-start my-1"
                key={index}
              >
                <span className="badge text-white bg-primary rounded-circle me-2">
                  {index + 1}
                </span>
                <Form.Control
                  type="text"
                  placeholder="Enter step e.g slice tomatoes"
                  value={step}
                  onChange={(event) => handleStepChange(event, index)}
                  required
                />
                <div
                  className="btn btn-outline-danger border-0"
                  onClick={() => removeStep(index)}
                >
                  <i className="bi bi-x-circle"></i>
                </div>
              </div>
            ))}

            <div className="d-flex flex-row align-items-center justify-content-center py-2 w-100">
              <div
                className="btn btn-outline-secondary border-0"
                onClick={addStep}
              >
                <span className="fw-bold">+ Add Step</span>
              </div>
            </div>
          </Form.Group>
          <button
            className="btn btn-primary w-100 mt-2 mb-4 py-2"
            type="submit"
          >
            {createButtonLoading && (
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
            <span className="text-white">Create Recipe</span>
          </button>
        </Form>
      </Modal.Body>
    </Modal>
  )
}
