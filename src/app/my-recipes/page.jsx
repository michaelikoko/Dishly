import { getAllTags, getAuthUserRecipe } from '../../actions/recipes'
import MyRecipes from '../../components/MyRecipes'
import PrivateComponent from '../../components/PrivateComponent'

export default async function Page() {
  let userRecipes
  userRecipes = await getAuthUserRecipe()
  if (!userRecipes) userRecipes = []

  const allTags = await getAllTags() // Get all tags/
  return (
    <div className="container-fluid min-vh-100 p-0">
      <PrivateComponent redirectTo={'my-recipes'}>
        <MyRecipes userRecipes={userRecipes} allTags={allTags} />
      </PrivateComponent>
    </div>
  )
}
