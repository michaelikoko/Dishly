/* eslint-disable no-console */
import tags from  './tags.json' with { type: 'json' }
import TagModel from '../models/tag.model.js'
import dotenv from 'dotenv'
dotenv.config()
import process from 'process'
import mongoose from 'mongoose'
import { MONGODB_URI } from '../utils/config.js'
import getSlug from 'speakingurl' // FOR CREATING SLUGS WITHOUT THE MONGOOSE PLUGIN - THIS IS USED IN THE MOCKING SCRIPT FOR RECIPES AND TAGS

async function seedTags() {
  try {
    // Connect to Mongodb
    await mongoose.connect(MONGODB_URI)
    console.log('Connected to the database!')

    const existingTags = await TagModel.find({}).exec()

    let numTagsSkipped = 0
    let numTagsAdded = 0

    for (const tag of tags) {
      //console.log(`Processing tag: ${tag.name}`)
      const existingTag = existingTags.find((t) => t.name === tag.name)

      if (existingTag) {
        // Skip the tag
        numTagsSkipped += 1
      } else {
        // Add the tag
        // tagTitle is the display name, and name is the unique name used for the slug to match spoonacular
        const tagSlug = getSlug(tag.name)
        await TagModel.create({ name: tag.tagTitle, slug: tagSlug })
        numTagsAdded += 1
      }
    }

    console.log(
      `${numTagsAdded} new tags added. ${numTagsSkipped} tags skipped.`
    )
    await mongoose.disconnect()
    console.log('Disconnected from the database!')
    return process.exit(0)
  } catch (error) {
    console.error('Error seeding tags:', error)
    return process.exit(1)
  }
}

seedTags()
