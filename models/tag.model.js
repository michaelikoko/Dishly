import mongoose from 'mongoose'
import slug from 'mongoose-slug-generator'

mongoose.set('strictQuery', true)
mongoose.plugin(slug)

const tagSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: [2, 'Tag name must be at least 2 characters long'],
      maxlength: [100, 'Tag name must be at most 100 characters long'],
      unique: true
    },
    slug: {
      type: String,
      slug: 'name',
      unique: true,
    },
    recipes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Recipe',
      },
    ],
  },
  { timestamps: true }
)

tagSchema.index({ name: 'text' })
const TagModel = mongoose.model('Tag', tagSchema)
export default TagModel
