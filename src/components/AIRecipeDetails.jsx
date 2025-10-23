
export default function AIRecipeDetails({ recipe }) {

  return (
    <>
      <div className="container pt-5 px-5">
        <div className="d-flex flex-column align-items-start justify-content-center">
          <div className="fw-bold h1">{recipe.title}</div>
          <div className="fs-6 text-muted mt-1 text-start">
            {recipe.description}
          </div>
          <div className="w-100  d-flex flex-row align-items-center justify-content-start py-1 px-0 mt-3 rounded-pill">
            {recipe.tags.map((tag, index) => (
              <span
                key={index}
                className="badge rounded-pill bg-secondary me-1 small"
              >
                {tag}
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
              <span className="ms-1 fs-6 text-muted">AI Generated</span>
            </div>
            {/*
            <div className="d-flex flex-row align-items-center justify-content-start ms-4">
              <div>
                <i
                  className='btn btn-outline-primary border-0 ms-2 bi bi-bookmark text-small'
                  //className={`btn btn-outline-primary border-0 ms-2 bi ${
                  //  isRecipeBookmarked ? 'bi-bookmark-fill' : 'bi-bookmark'
                  //} text-small`}
                  // onClick={handleBookmarkToggle}
                ></i>
              </div>
              <div>
                <i className="btn btn-outline-primary border-0 ms-2 bi bi-share-fill text-small"></i>
              </div>
            </div>
            */}
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
    </>
  )
}
