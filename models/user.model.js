import mongoose from 'mongoose'

mongoose.set('strictQuery', true)

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: [5, 'Email must be at least 5 characters long'],
      maxlength: [50, 'Email must be at most 50 characters long'],
    },
    passwordHash: {
      type: String,
      required: true,
      trim: true,
    },
    displayName: {
      type: String,
      required: true,
      trim: true,
      minlength: [2, 'Display name must be at least 2 characters long'],
      maxlength: [50, 'Display name must be at most 50 characters long'],
    },
    bookmarkedRecipes: [
      // Array of recipe IDs bookmarked by the user
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Recipe',
      }
    ]
  },
  { timestamps: true }
)

/* Set virtual populate in order to get recipes created by a user when querying the UserModel but not storing them in the database - The Principle of Least Cardinality: one-to-many relationships should be stored on the 'many' side */
userSchema.virtual('recipes', {
  ref: 'Recipe',
  localField: '_id',
  foreignField: 'creator',
})

userSchema.set('toObject', { virtuals: true }) // Ensure virtual fields are included when document is converted to Object
userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    if (returnedObject._id) {
      // For edge cases, when nest populating the User model with a field with ref to User, it queries User model twice and the first time deletes the _id and id fields making the second time fail to find them
      returnedObject.id = returnedObject._id.toString()
    }
    delete returnedObject._id // Remove _id field
    delete returnedObject.id // Remove id field from JSON output
    delete returnedObject.__v // Remove __v field
    delete returnedObject.passwordHash // Do not reveal password hash
    delete returnedObject.createdAt // Remove createdAt field
    delete returnedObject.updatedAt // Remove updatedAt field
    delete returnedObject.bookmarkedRecipes // Remove bookmarkedRecipes field
  },
  virtuals: true // Ensure virtual fields are included when document is converted to JSON
})

const UserModel = mongoose.model('User', userSchema)
export default UserModel
