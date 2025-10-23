import mongoose from 'mongoose'

// Remember to set cron job to clear refresh token field periodically
mongoose.set('strictQuery', true)

const refreshTokenSchema = new mongoose.Schema(
  {
    token: {
      // The refresh token string
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    user: {
      // Reference to the User model
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    expiryDate: {
      // Expiry date of the refresh token
      type: Date,
      required: true,
      default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Default expiry is 7 days
    },
  },
  { timestamps: true }
)

const RefreshTokenModel = mongoose.model('RefreshToken', refreshTokenSchema)
export default RefreshTokenModel
