import HeroSection from '../components/HeroSection'
import RecentRecipes from '../components/RecentRecipes'
import { getRecentRecipes } from '../actions/recipes'

// DO A PROPER ERROR HANDLING IF RECIPES IS NULL

export default async function Page() {
  const recentRecipes = await getRecentRecipes()
  //console.log(recentRecipes)

  return (
    <div className="container-fluid p-0 m-0">
      <HeroSection />
      {recentRecipes && recentRecipes.length > 0 && (
        <RecentRecipes recipes={recentRecipes} />
      )}
      <div className="bg-white py-5 mb-4">
        <div className="container">
          <div className="d-flex flex-column align-items-center justify-content-center mb-5">
            <div className="fs-1 fw-bolder lead">
              Join Our Growing Community
            </div>
            <div className="lead my-1 fw-light text-center fs-6">
              Connect with passionate home cooks from around the world
            </div>
          </div>

          <div className="row g-3 p-0">
            <div className="col-md-4 col-">
              <div className="bg-light py-5 rounded-3 shadow-sm">
                <div className="d-flex flex-column align-items-center justify-content-center">
                  <i className="bi bi-people-fill bg-primary p-2 text-light rounded-circle"></i>
                  <div className="fs-2 fw-bold">50+</div>
                  <div className="text-muted">Active Cooks</div>
                </div>
              </div>
            </div>
            <div className="col-md-4 col-">
              <div className="bg-light py-5 rounded-3 shadow-sm">
                <div className="d-flex flex-column align-items-center justify-content-center">
                  <i className="bi bi-fork-knife bg-secondary p-2 text-light rounded-circle"></i>
                  <div className="fs-2 fw-bold">75+</div>
                  <div className="text-muted">Shared Recipes</div>
                </div>
              </div>
            </div>
            <div className="col-md-4 col-">
              <div className="bg-light py-5 rounded-3 shadow-sm">
                <div className="d-flex flex-column align-items-center justify-content-center">
                  <i className="bi bi-heart-fill bg-primary p-2 text-light rounded-circle"></i>
                  <div className="fs-2 fw-bold">100+</div>
                  <div className="text-muted">Recipe Saves</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
