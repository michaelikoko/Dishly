import RecipeModel from '../models/recipe.model.js'
import UserModel from '../models/user.model.js'
import TagModel from '../models/tag.model.js'
import { successResponse, errorResponse } from '../utils/response.js'
import { StatusCodes } from 'http-status-codes'
import cloudinary from '../utils/image.js'
import { GoogleGenAI, Type } from '@google/genai'
import { GEMINI_API_KEY } from '../utils/config.js'

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY })


export async function getRecipes(request, response) {
  // Retrieve and return a list of recipes
  const { page, limit, sort, tags, search } = request.query
  //console.log(page, limit, tags, sort)

  let tagsIds = [] // Array of tag ObjectIds
  if (tags) {
    // Get the tag IDs from the slugs
    tagsIds = await TagModel.find({ slug: { $in: tags } }).select('_id')
  }
  // console.log(tagsIds)

  let query = {}
  if (tagsIds.length > 0) {
    // Filter by tags
    query = { tags: { $in: tagsIds } }
  }
  if (search) {
    // Add text search to the query
    query.$text = { $search: search }
  }

  let sortOption = { createdAt: -1 } // Default sort by newest
  if (sort) {
    // The _id is added to avoid duplicates when multiple recipes have the same title or preparation time cause those fields are not unique
    if (sort === 'title_asc') {
      sortOption = { title: 1, _id: 1 }
    } else if (sort === 'title_desc') {
      sortOption = { title: -1, _id: -1 }
    } else if (sort === 'prep_asc') {
      sortOption = { preparationTime: 1, _id: 1 }
    } else if (sort === 'prep_desc') {
      sortOption = { preparationTime: -1, _id: -1 }
    }
  }

  const paginateOptions = {
    page: page ? parseInt(page, 10) : 1,
    limit: limit ? parseInt(limit, 10) : 8,
    populate: [
      {
        path: 'tags',
        select: 'name',
      },
      {
        path: 'creator',
        select: 'displayName',
      },
    ],
    select:
      'title description slug tags imageUrl creator createdAt preparationTime',
    sort: sortOption,
  }

  //console.log(paginateOptions)
  //console.log(`Found ${recipes.length} recipes in the database`)

  const recipes = await RecipeModel.paginate(query, paginateOptions)

  // Implement a search feature later, it should also search through tags
  const message = search ? `Recipes matching '${search}' retrieved successfully` : 'Recipes retrieved successfully'
  return response
    .status(StatusCodes.OK)
    .json(successResponse(message, recipes))
}

export async function getRecentRecipes(request, response) {
  // Retrieve and return the last 6 created recipes

  const recentRecipes = await RecipeModel.find({})
    .sort({ createdAt: -1 })
    .limit(6)
    .select(
      'title description slug tags imageUrl creator createdAt preparationTime'
    )
    .populate('tags', 'name')
    .populate('creator', 'displayName')

  return response
    .status(StatusCodes.OK)
    .json(
      successResponse('Recent recipes retrieved successfully', recentRecipes)
    )
}

export async function getRecipeBySlug(request, response) {
  // Retrieve and return a recipe by its slug

  const slug = request.params?.slug
  if (!slug) {
    return response
      .status(StatusCodes.BAD_REQUEST)
      .json(errorResponse('Slug is required'))
  }

  const recipe = await RecipeModel.findOne({ slug: slug })
    .populate('tags', 'name')
    .populate('creator', 'displayName email')
  if (!recipe) {
    return response
      .status(StatusCodes.NOT_FOUND)
      .json(errorResponse('Slug does not match any recipe in the database'))
  }

  // For authenticated users, check if they have bookmarked the recipe
  const user = request.user
  let isBookmarked = false
  if (user) {
    if (recipe.bookmarkedBy.includes(user._id)) isBookmarked = true
  }
  return response.status(StatusCodes.OK).json(
    successResponse('Recipe retrieved successfully', {
      ...recipe.toJSON(),
      isBookmarked,
    })
  )
}

export async function createRecipe(request, response) {
  // Create a new recipe

  const { title, description, ingredients, steps, preparationTime, tags } =
    request.body

  if (!request.file) {
    // Image is required
    return response
      .status(StatusCodes.BAD_REQUEST)
      .json(errorResponse('Image is required'))
  }

  const user = request.user

  const creator = await UserModel.findOne({ email: user.email })

  // Get valid tags
  let validTags = []
  if (tags && typeof tags === 'string' && tags.length > 0){
    validTags = await TagModel.find({ slug: { $in: tags.split(',') } }).select('_id')
  }
  if (tags && Array.isArray(tags) && tags.length > 0) {
    //console.log(tags)
    //validTags = await TagModel.find({ _id: { $in: tags } }).select('_id')
    validTags = await TagModel.find({ slug: { $in: tags } }).select('_id') // Decided to use slug passed from the client to search for tags
    //console.log('valid tags', validTags)
  }

  // Upload image to Cloudinary

  const imageFile = request.file
  const imageResult = await new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: 'image', folder: 'dishly/recipes' },
      (error, result) => {
        if (error) reject(error)
        resolve({
          url: result?.secure_url,
          id: result?.public_id,
        })
      }
    )
    stream.end(imageFile.buffer)
  })

  //console.log('Image uploaded to Cloudinary:', imageResult)
  const newRecipe = await RecipeModel.create({
    title,
    description,
    ingredients,
    steps,
    preparationTime,
    creator: creator.id,
    tags: validTags,
    imageUrl: imageResult.url,
  })

  // Add the recipe to the tags' recipes array
  /* CHANGE THIS TO MIDDLEWARE */
  for (const tag of validTags) {
    await TagModel.findByIdAndUpdate(tag._id, {
      $push: { recipes: newRecipe._id },
    })
  }

  await newRecipe.populate('tags', 'name')

  return response
    .status(StatusCodes.CREATED)
    .json(successResponse('Recipe created successfully', newRecipe))
}

export async function getAuthUserRecipes(request, response) {
  // Retrieve and return recipes created by the authenticated user

  const user = request.user
  const creator = await UserModel.findOne({ email: user.email })

  const recipes = await RecipeModel.find({ creator: creator.id })
    .populate('tags', 'name')
    .populate('creator', 'displayName')
    .sort({ createdAt: -1 })
    .select(
      'title description slug tags imageUrl creator createdAt preparationTime'
    )

  return response
    .status(StatusCodes.OK)
    .json(successResponse('User recipes retrieved successfully', recipes))
}

export async function deleteRecipeBySlug(request, response) {
  // Delete a recipe by its slug owned by an authorized user
  const slug = request.params?.slug
  if (!slug) {
    return response
      .status(StatusCodes.BAD_REQUEST)
      .json(errorResponse('Slug is required'))
  }

  const recipe = await RecipeModel.findOne({ slug: slug })
    .populate('tags', 'name')
    .populate('creator', 'displayName email _id')
  if (!recipe) {
    return response
      .status(StatusCodes.NOT_FOUND)
      .json(errorResponse('Slug does not match any recipe in the database'))
  }
  const user = request.user
  const creator = await UserModel.findOne({ email: user.email })

  if (creator._id.equals(recipe.creator._id)) {
    // Delete the recipe from the tags' recipes array
    /* CHANGE THIS TO MIDDLEWARE */
    for (const tag of recipe.tags) {
      await TagModel.findByIdAndUpdate(tag._id, {
        $pull: { recipes: recipe._id },
      })
    }
    await RecipeModel.findByIdAndDelete(recipe._id).exec() // Delete the recipe
    return response.status(StatusCodes.NO_CONTENT).json()
  } else {
    return response
      .status(StatusCodes.UNAUTHORIZED)
      .json(errorResponse('Unauthorized'))
  }
}

export async function getAuthUserBookmarkedRecipes(request, response) {
  // Retrieve and return recipes bookmarked by the authenticated user

  const user = await UserModel.findOne({ email: request.user.email })

  const recipes = await RecipeModel.find({
    _id: { $in: user.bookmarkedRecipes },
  })
    .populate('tags', 'name')
    .populate('creator', 'displayName')
    .sort({ createdAt: -1 })
    .select(
      'title description slug tags imageUrl creator createdAt preparationTime'
    )

  return response
    .status(StatusCodes.OK)
    .json(successResponse('Bookmarked recipes retrieved successfully', recipes))
}

export async function bookmarkRecipe(request, response) {
  // Bookmark a recipe for the authenticated user
  const slug = request.params?.slug
  if (!slug) {
    return response
      .status(StatusCodes.BAD_REQUEST)
      .json(errorResponse('Slug is required'))
  }

  const recipe = await RecipeModel.findOne({ slug: slug })
  if (!recipe) {
    return response
      .status(StatusCodes.NOT_FOUND)
      .json(errorResponse('Slug does not match any recipe in the database'))
  }

  const user = await UserModel.findOne({ email: request.user.email })

  // Add recipe to user's bookmarkedRecipes if not already bookmarked
  if (!user.bookmarkedRecipes.includes(recipe._id)) {
    user.bookmarkedRecipes.push(recipe._id)
    recipe.bookmarkedBy.push(user._id)

    await recipe.save()
    await user.save()
  }

  return response
    .status(StatusCodes.OK)
    .json(successResponse('Recipe bookmarked successfully'))
}

export async function unbookmarkRecipe(request, response) {
  // Unbookmark a recipe for the authenticated user
  const slug = request.params?.slug
  if (!slug) {
    return response
      .status(StatusCodes.BAD_REQUEST)
      .json(errorResponse('Slug is required'))
  }

  const recipe = await RecipeModel.findOne({ slug: slug })
  if (!recipe) {
    return response
      .status(StatusCodes.NOT_FOUND)
      .json(errorResponse('Slug does not match any recipe in the database'))
  }

  const user = await UserModel.findOne({ email: request.user.email })

  // Remove recipe from user's bookmarkedRecipes if bookmarked
  if (user.bookmarkedRecipes.includes(recipe._id)) {
    user.bookmarkedRecipes.pull(recipe._id)
    recipe.bookmarkedBy.pull(user._id)

    await recipe.save()
    await user.save()
  }

  return response
    .status(StatusCodes.OK)
    .json(successResponse('Recipe unbookmarked successfully'))
}

export async function clearBookmarkedRecipes(request, response) {
  // Clear all bookmarked recipes for the authenticated user
  const user = await UserModel.findOne({ email: request.user.email })

  // Remove the user from all recipes they have bookmarked
  await RecipeModel.updateMany(
    { _id: { $in: user.bookmarkedRecipes } },
    { $pull: { bookmarkedBy: user._id } }
  ).exec()

  // Clear the user's bookmarkedRecipes array
  user.bookmarkedRecipes = []
  await user.save()

  return response
    .status(StatusCodes.OK)
    .json(successResponse('All bookmarked recipes cleared successfully'))
}

export async function generateAIRecipe(request, response) {
  const prompt = request.body?.prompt

  if (!prompt) {
    return response
      .status(StatusCodes.BAD_REQUEST)
      .json(errorResponse('Prompt is required'))
  }

  const systemPrompt = `
You are a professional chef assistant that creates recipes based on user requests.

Generate a clear, complete, and realistic recipe in JSON format only.

Each recipe must include:
- "title": A concise name for the dish.
- "description": A short summary of the dish (1-3 sentences).
- "tags": A list of relevant tags or categories (as strings)(2-3 tags, with one being "AI").
- "ingredients": A list of all necessary ingredients (as strings).
- "steps": Step-by-step cooking instructions (as strings, clear and ordered).
- "preparationTime": The approximate total time in minutes as a number (integer).
- *error*: A string field to indicate an error message when the request is out of context. Leave blank otherwise

If the user's request is NOT related to food, cooking, or recipes, 
return only a JSON object with the key "error" and a helpful message. Leave out all other fields, only the error field should have a value

Otherwise, generate a recipe in the format:
{
  "title": string,
  "description": string,
  "tags": string[],
  "ingredients": string[],
  "steps": string[],
  "preparationTime": number
}
Always respond in strict JSON format with no extra text.
Do not include markdown, explanations, or text outside the JSON.
`

  const aiResponse = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: `${systemPrompt}\n\nUser prompt: ${prompt}`,
    config: {
      responseMimeType: 'application/json',
      responseJsonSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          tags: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
          ingredients: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
          steps: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
          preparationTime: { type: Type.NUMBER },
          error: { type: Type.STRING },
        },
        required: [
          'title',
          'description',
          'tags',
          'ingredients',
          'steps',
          'preparationTime',
        ],
      },
    },
  })
  //console.log('AI Response:', aiResponse)
  const jsonData = JSON.parse(aiResponse.text)
  return response
    .status(StatusCodes.OK)
    .json(successResponse('AI recipe generated successfully', jsonData))
}
