import { getBookmarkedRecipe } from '../../actions/recipes'
import PrivateComponent from '../../components/PrivateComponent'
import SavedRecipes from '../../components/SavedRecipes'

export default async function page() {
  let savedRecipes
  savedRecipes = await getBookmarkedRecipe()
  if (!savedRecipes) savedRecipes = []

  return (
    <div className="container-fluid min-vh-100 p-0">
      <PrivateComponent redirectTo={'saved-recipes'}>
        <SavedRecipes savedRecipes={savedRecipes} />
      </PrivateComponent>
    </div>
  )
}
