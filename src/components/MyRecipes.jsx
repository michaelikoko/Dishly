'use client'
import { useContext, useState } from 'react'
import UserContext from '../context/UserContext'
import RecipeCard from './RecipeCard'
import CreateRecipeModal from './CreateRecipeModal'

export default function MyRecipes({ userRecipes, allTags }) {
  const [user, userDispatch] = useContext(UserContext)
  const [showCreateRecipeModal, setShowCreateRecipeModal] = useState(false)
  const handleCloseCreateRecipeModal = () => setShowCreateRecipeModal(false)
  const handleShowCreateRecipeModal = () => setShowCreateRecipeModal(true)

  return (
    <>
      <CreateRecipeModal
        show={showCreateRecipeModal}
        onClose={handleCloseCreateRecipeModal}
        allTags={allTags}
      />

      <div className="container-fluid bg-light">
        <div className="min-vh-100 container py-4">
          <div className="d-flex flex-row justify-content-between align-items-center row">
            <div className="d-flex flex-column justify-content-center align-items-start col-12 col-sm-8 col-lg-10">
              <span className="fs-3 fw-bolder">My Recipes</span>
              <span className="text-muted small">
                Manage your collection of delicious recipes
              </span>
            </div>
            <div
              className="btn btn-primary col-12 col-sm-4 col-lg-2"
              onClick={handleShowCreateRecipeModal}
            >
              <span className="small text-white fw-bold">
                + Create New Recipe
              </span>
            </div>
          </div>
          <div className="row py-4">
            <div className="col-sm-6 col-12">
              <div className="card bg-white">
                <div className="card-body d-flex flex-row align-items-center justify-content-between ">
                  <div className="d-flex flex-column justify-content-center align-items-start">
                    <span className="text-muted fs-6 fw-medium">
                      Total Recipes
                    </span>
                    <span className="fw-bolder fs-4">{userRecipes.length}</span>
                  </div>
                  <div className="bg-secondary bg-opacity-10 p-2 rounded">
                    <i className="bi bi-journal-text fs-3 text-secondary"></i>
                  </div>
                </div>
              </div>
            </div>
            {/*
            <div className="col">
              <div className="card bg-white">
                <div className="card-body d-flex flex-row align-items-center justify-content-between ">
                  <div className="d-flex flex-column justify-content-center align-items-start">
                    <span className="text-muted fs-6 fw-medium">
                      Total Saves
                    </span>
                    <span className="fw-bolder fs-4">0</span>
                  </div>
                  <div className="bg-primary bg-opacity-10 p-2 rounded">
                    <i className="bi bi-heart-fill fs-3 text-primary"></i>
                  </div>
                </div>
              </div>
            </div>
                    */}
          </div>
          <div className="row g-3 p-0">
            {userRecipes.map((recipe) => (
              <div className="col-md-3 col-12" key={recipe._id}>
                <RecipeCard recipe={recipe} showDelete={true} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
