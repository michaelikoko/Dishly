/* eslint-disable no-console */
import dotenv from 'dotenv'
dotenv.config()
import process from 'process'
import mongoose from 'mongoose'
import { MONGODB_URI } from './config.js'

export async function connectToDatabase() {
  try {
    await mongoose.connect(MONGODB_URI)
    console.log('Connected to the database!')
  } catch (error) {
    console.log('Failed to connect to the database!', error)
    await mongoose.disconnect()
    return process.exit(1)
  }
  return null
}
