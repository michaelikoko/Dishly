import dotenv from 'dotenv'
dotenv.config()
import process from 'process'

export const MONGODB_URI  = process.env.NODE_ENV === 'production' ? process.env.MONGODB_URI_PROD : process.env.MONGODB_URI_DEV
export const PORT = process.env.PORT || 3001
export const SECRET = process.env.NODE_ENV === 'production' ? process.env.SECRET : 'jwt-secret-key'
export const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME
export const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY
export const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET
export const GEMINI_API_KEY = process.env.GEMINI_API_KEY
