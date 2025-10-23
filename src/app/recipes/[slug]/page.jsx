import { getRecipeBySlug } from '../../../actions/recipes'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import RecipeDetails from '../../../components/RecipeDetails'

export default async function Page({ params }) {
  const { slug } = await params

  const recipe = await getRecipeBySlug({ slug })
  if (!recipe) {
    return notFound()
  }

  return <RecipeDetails recipe={recipe} />
}
