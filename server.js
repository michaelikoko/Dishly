/* eslint-disable no-console */
import next from 'next'
import { default as expressApp } from './app.js'
import { PORT } from './utils/config.js'
import { connectToDatabase } from './utils/db.js'
import notFound from './middleware/not-found.js'
import errorHandler from './middleware/error-handler.js'

const dev = process.env.NODE_ENV !== 'production' // Determine if in development mode or production
const app = next({ dev })
const handle = app.getRequestHandler()

app
  .prepare()
  .then(async () => {
    expressApp.all('/_next/{*any}', (req, res) => {
      // Handle Next.js static files
      return handle(req, res)
    })
    expressApp.all('/', (req, res) => {
      // Handle home page
      return handle(req, res)
    })
    expressApp.all('/recipes/', (req, res) => {
      // Handle recipes listing page
      return handle(req, res)
    })
    expressApp.all('/recipes/{*any}', (req, res) => {
      // Handle individual recipe details page
      return handle(req, res)
    })
    expressApp.all('/my-recipes/', (req, res) => {
      // Handle user's own recipes page
      return handle(req, res)
    })
    expressApp.all('/saved-recipes/', (req, res) => {
      // Handle user's saved recipes page
      return handle(req, res)
    })
    // Use error handling middlewares
    expressApp.use(notFound) // Use custom notFound middleware
    expressApp.use(errorHandler) // Use custom errorHandler middleware

    try {
      await connectToDatabase()
      expressApp.listen(PORT, console.log(`Server running on port ${PORT}`))
    } catch (error) {
      console.log('Error starting server!')
      console.error(error)
    }
  })
  .catch((error) => {
    console.error('Error preparing Next.js app:', error)
  })
