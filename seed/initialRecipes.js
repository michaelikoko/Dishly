/* eslint-disable no-console */
import mongoose from 'mongoose'
import getSlug from 'speakingurl'
import dotenv from 'dotenv'
dotenv.config()
import RecipeModel from '../models/recipe.model.js'
import TagModel from '../models/tag.model.js'
import { MONGODB_URI } from '../utils/config.js'

import spoonacularData from './spoonacular-response.json' with { type: 'json' }

// Transform data
function extractRecipes(data) {
  const recipes = data.results.map((item) => {
    const ingredients = []
    const steps = []

    if (item.analyzedInstructions?.length > 0) {
      for (const instruction of item.analyzedInstructions) {
        for (const step of instruction.steps) {
          // Extract ingredient names (unique)
          if (step.ingredients?.length > 0) {
            for (const ing of step.ingredients) {
              if (ing.name && !ingredients.includes(ing.name)) {
                ingredients.push(ing.name)
              }
            }
          }

          // Extract step text
          if (step.step) steps.push(step.step.trim())
        }
      }
    }

    if (item.title) {
      return {
        title: item.title,
        description:
            item.summary
              ?.replace(/<\/?[^>]+(>|$)/g, '') // remove HTML tags
              .replace(/\s+/g, ' ')
              .trim() ||
            'No description available.',
        ingredients,
        steps,
        preparationTime: item.readyInMinutes || 0,
        image: item.image || null,
        tags: item.dishTypes || [],
        imageUrl: item.image || null
      }
    }
  })

  return recipes
}
const extractedRecipes = extractRecipes(spoonacularData)

const CREATOR_ID = '68f925c6681a8382cd527c74' // Creator user ID

// Create recipes for the site with data from spoonacular API

async function seedRecipes() {
  try {
    await mongoose.connect(MONGODB_URI)
    console.log('Connected to database')

    //await RecipeModel.deleteMany({})
    //console.log('Cleared existing recipes')

    let seededRecipes = []
    for (const recipe of extractedRecipes) {
      const tagSlugs = (recipe.tags || []).map((tag) => getSlug(tag))
      const tagObjects = await TagModel.find({ slug: { $in: tagSlugs } }).exec()
      const tagIds = tagObjects.map(tag => tag._id)

      seededRecipes.push({
        ...recipe,
        tags: tagIds,
        creator: CREATOR_ID,
        slug: getSlug(recipe.title)
      })
    }

    await RecipeModel.insertMany(seededRecipes)
    console.log(`Inserted ${seededRecipes.length} recipes successfully.`)
  } catch (error) {
    console.error('Error seeding recipes:', error)
  } finally {
    await mongoose.disconnect()
    console.log('Disconnected from MongoDB')
  }
}

seedRecipes()
