import { axiosClient } from '../lib/axiosClient'
import qs from 'qs'

export async function getAllTags() {
  try {
    const response = await axiosClient.get('/tags')
    return response.data.data
  } catch {
    return null
  }
}

export async function getRecentRecipes() {
  try {
    const response = await axiosClient.get('/recipes/recent')
    return response.data.data
  } catch (error) {
    return null
  }
}

export async function getRecipes({ page, sort, tags, search }) {
  const limit = 8
  let params = {
    page,
    limit,
  }

  if (sort) {
    params.sort = sort
  }
  if (tags && tags.length > 0) {
    params.tags = tags
  }

  if (search) {
    params.search = search
  }

  try {
    const response = await axiosClient.get('/recipes', {
      params,
      paramsSerializer: (params) => {
        return qs.stringify(params, { arrayFormat: 'repeat' })
      },
    })
    return response.data.data
  } catch (error) {
    return null
  }
}

export async function getRecipeBySlug({ slug }) {
  if (!slug) return null

  try {
    const response = await axiosClient.get(`/recipes/slug/${slug}`)
    return response.data.data
  } catch {
    return null
  }
}

export async function getAuthUserRecipe() {
  try {
    const response = await axiosClient.get('/recipes/me')
    return response.data.data
  } catch (error) {
    return null
  }
}

export async function createRecipe(formData) {
  await axiosClient.post('/recipes', formData)
}

export async function deleteRecipeBySlug({ slug }) {
  await axiosClient.delete(`/recipes/slug/${slug}`)
}

export async function bookmarkRecipe({ slug }) {
  await axiosClient.put(`/recipes/bookmark/me/${slug}`)
}

export async function unbookmarkRecipe({ slug }) {
  await axiosClient.delete(`/recipes/bookmark/me/${slug}`)
}

export async function getBookmarkedRecipe() {
  try {
    const response = await axiosClient.get('/recipes/bookmark/me')
    return response.data.data
  } catch (error) {
    return null
  }
}

export async function clearBookmarkedRecipes() {
  await axiosClient.delete('/recipes/bookmark/me/clear')
}

export async function generateAIRecipe({ prompt }) {
  return await axiosClient.post('/recipes/ai', { prompt })
}
