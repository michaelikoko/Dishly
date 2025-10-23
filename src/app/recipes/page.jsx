import { getRecipes, getAllTags } from '../../actions/recipes'
import AllRecipes from '../../components/AllRecipes'

export default async function Page({ searchParams }) {
  const sp = await searchParams
  const search  = await sp.search || null
  let recipes
  if (search) {
    recipes = await getRecipes({ page: 1, search }) // Get the first page of recipes based on search
  } else {
    recipes = await getRecipes({ page: 1 }) // Get the first page of recipes
  }
  const allTags = await getAllTags() // Get all tags/
  //console.log(recipes)

  if (!recipes) {
    return (
      <div className="container-fluid bg-light min-vh-100">
        <div className="container d-flex flex-column justify-content-start align-items-start py-4">
          <div className="fw-bolder fs-1 lead">All Recipes</div>
          <div className="lead fs-6 text-muted">
            Discover delicious recipes from our community
          </div>
        </div>
        <div className="alert alert-danger" role="alert">
          Failed to load recipes. Please try again later.
        </div>
      </div>
    )
  }

  return (
    <div className="container-fluid bg-light min-vh-100">
      <div className="container d-flex flex-column justify-content-start align-items-start py-4">
        <div className="fw-bolder fs-1 lead">All Recipes</div>
        <div className="lead fs-6 text-muted">
          Discover delicious recipes from our community
        </div>
      </div>
      <AllRecipes recipes={recipes} allTags={allTags} search={search} />
    </div>
  )
}
