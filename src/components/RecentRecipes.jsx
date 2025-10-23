import RecipeCard from './RecipeCard'
import Link from 'next/link'

export default function RecentRecipes({ recipes }) {
  if (!recipes || recipes.length === 0) {
    return <p>No recent recipes found.</p>
  }

  return (
    <div className="bg-light py-5">
      <div className="container">
        <div className="d-flex flex-column align-items-center justify-content-center mb-5">
          <div className="fs-1 fw-bolder lead">Trending Recipes</div>
          <div className="lead my-1 fw-light fs-6">
            Discover what&apos;s cooking in our community
          </div>
        </div>
        <div className="row g-3 p-0">
          {recipes.map((recipe) => (
            <div key={recipe._id} className="col-md-4 col-12">
              <RecipeCard recipe={recipe} />
            </div>
          ))}
        </div>
        <div className="d-flex align-items-center justify-content-center my-5">
          <Link href="/recipes" className="text-decoration-none">
            <div className="btn btn-outline-primary rounded-pill fw-medium py-2 px-4">
              View All Recipes
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}
