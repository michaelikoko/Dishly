'use client'
import { Form, Spinner, Toast } from 'react-bootstrap'
import AIOutOfContext from './AIOutOfContext'
import AIRecipeDetails from './AIRecipeDetails'
import { useState } from 'react'
import { generateAIRecipe } from '../actions/recipes'

export default function AIPage() {
  const [generateButtonLoading, setGenerateButtonLoading] = useState(false)
  const [prompt, setPrompt] = useState('')
  const [showToast, setShowToast] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [aiResponse, setAiResponse] = useState(null)

  const handleGenerateRecipe = async (event) => {
    event.preventDefault()
    if (generateButtonLoading) return // Prevent multiple submissions
    setGenerateButtonLoading(true)
    try {
      const response = await generateAIRecipe({ prompt })
      setAiResponse(response.data.data)
      setPrompt('')
      setErrorMessage('')
      setShowToast(false)
    } catch (error) {
      setErrorMessage(
        'An error occurred while generating the recipe. Please try again.'
      )
      setShowToast(true)
    } finally {
      setGenerateButtonLoading(false)
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
      <div className="container-fluid bg-light min-vh-100">
        <div className="container d-flex flex-column align-items-center justify-content-center py-5 px-0 px-md-5" style={{
          maxWidth: '950px'
        }}>
          <h1 className="h-4 fw-bold text-center">AI Recipe Generator</h1>
          <p className="lead fs-6 text-muted text-center mt-2">
            Describe the ingredients you have or the type of dish you want to
            create, and the AI will generate a delicious recipe for you!
          </p>
          {aiResponse !== null ? (
            aiResponse?.error ? (
              // Render out-of-context message
              <div className="d-flex flex-row align-items-center justify-content-start w-100">
                <AIOutOfContext message={aiResponse?.error} />
              </div>
            ) : (
              // Render generated recipe details
              <div className="d-flex flex-column align-items-center justify-content-start w-100 card shadow-lg my-4">
                <div className="card-body">
                  <AIRecipeDetails recipe={aiResponse} />
                </div>
              </div>
            )
          ) : (
            // No response yet
            <></>
          )}

          <Form
            className="p-0 container mt-4 d-flex flex-column align-items-end justify-content-center"
            onSubmit={handleGenerateRecipe}
          >
            <Form.Group
              className="w-100"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Control
                as="textarea"
                placeholder="Describe ingredients or dish you want to create"
                rows={5}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                required
              />
            </Form.Group>
            <button
              className="btn btn-primary d-flex align-items-center justify-content-center mt-4 py-2 px-4"
              type="submit"
            >
              {generateButtonLoading ? (
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  variant="white"
                  className='fs-5 my-1'
                />
              ) : (
                <i className="bi bi-send-fill text-white fs-6 fw-bolder"></i>
              )}
            </button>
          </Form>
        </div>
      </div>
    </>
  )
}
