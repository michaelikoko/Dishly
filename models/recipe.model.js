import mongoose from 'mongoose'
import slug from 'mongoose-slug-generator'
import mongoosePaginate from 'mongoose-paginate-v2'

mongoose.set('strictQuery', true)
mongoose.plugin(slug)

const recipeSchema = new mongoose.Schema(
  {
    title: {
      // Title of the recipe
      type: String,
      required: true,
      trim: true,
      minlength: [2, 'Title must be at least 2 characters long'],
      maxlength: [100, 'Title must be at most 100 characters long'],
    },
    description: {
      // Short description of the recipe
      type: String,
      required: true,
      trim: true,
      minlength: [10, 'Description must be at least 10 characters long'],
      maxlength: [1500, 'Description must be at most 1500 characters long'],
    },
    slug: {
      type: String,
      slug: 'title',
      unique: true
    },
    imageUrl: {
      // URL to an image representing the recipe
      type: String,
      required: false,
      trim: true,
    },
    ingredients: {
      // List of ingredients - An array of strings
      type: [
        {
          type: String,
          minLength: [2, 'Ingredient must be at least 2 character long'],
          maxLength: [100, 'Ingredient must be at most 100 characters long'],
          trim: true,
          index: true,
        },
      ],
      minLength: [1, 'At least one ingredient is required'],
      maxLength: [50, 'At most 50 ingredients are allowed'],
      required: true,
    },
    steps: {
      // Steps to prepare the recipe - An array of strings
      type: [
        {
          type: String,
          minLength: [2, 'Step must be at least 2 characters long'],
          maxLength: [1000, 'Step must be at most 1000 characters long'],
          index: true,
        },
      ],
      minLength: [1, 'At least one step is required'],
      maxLength: [100, 'At most 100 steps are allowed'],
      required: true,
    },
    preparationTime: {
      // Preparation time in minutes
      type: Number, // in minutes
      required: false,
    },
    creator: {
      // Reference to the User model
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    tags: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tag',
      }
    ],
    bookmarkedBy: [
      // Array of users who bookmarked this recipe
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      }
    ]
  },
  { timestamps: true }
)

recipeSchema.index({
  title: 'text',
  description: 'text',
  ingredients: 'text',
  steps: 'text',
  tags: 'text'
})

recipeSchema.plugin(mongoosePaginate)
const RecipeModel = mongoose.model('Recipe', recipeSchema)
export default RecipeModel
