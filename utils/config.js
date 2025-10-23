import dotenv from 'dotenv'
dotenv.config()
import process from 'process'

let MONGODB_URI
if (process.env.NODE_ENV === 'production') {
  // Use production database URI
  MONGODB_URI = process.env.MONGODB_URI_PROD
} else {
  // Use development database URI
  MONGODB_URI = process.env.MONGODB_URI_DEV
}
export { MONGODB_URI }
export const PORT = process.env.PORT || 3001
export const SECRET = process.env.SECRET
export const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME
export const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY
export const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET
export const GEMINI_API_KEY = process.env.GEMINI_API_KEY
