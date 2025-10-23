import express from 'express'

// Import middlewares
import morgan from 'morgan'
import cors from 'cors'
import errorHandler from './middleware/error-handler.js'
import notFound from './middleware/not-found.js'
import passport from './middleware/passport.js'

// Import routes
import userRoutes from './routes/user.routes.js'
import tagRoutes from './routes/tag.routes.js'
import recipeRoutes from './routes/recipe.routes.js'

// Import openapi docs
import swaggerJSDoc from 'swagger-jsdoc'
import swaggerui from 'swagger-ui-express'
import { PORT } from './utils/config.js'
import redoc from 'redoc-express'

// Set up express app
const app = express()

// Use middlewares
//app.use(express.static('dist')) // Serve static files
app.use(express.static('public'))

app.use(cors()) // Enable CORS
app.use(express.json()) // Parse JSON request
app.use(express.urlencoded({ extended: true })) // Parse URL-encoded request
app.use(morgan('dev')) // Log HTTP requests
app.use(passport.initialize()) // Initialize passport for authentication

// Set up Swagger API documentation options
const swaggerOptions = {
  failOnErrors: true, // Whether or not to throw when parsing errors. Defaults to false.
  definition: {
    openapi: '3.1.0',
    info: {
      title: 'Dishly API',
      version: '1.0.0',
      description:
        'API documentation for Dishly, a recipe sharing application.',
      license: {
        name: 'MIT',
        url: 'https://spdx.org/licenses/MIT.html',
      },
      contact: {
        name: 'Michael Ikoko',
        url: 'https://michaelikoko.github.io',
        email: 'michaelikoko.o@gmail.com',
      },
    },
    components: {
      securitySchemes: {
        basicAuth: {
          type: 'http',
          scheme: 'basic',
        },
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    servers: [
      {
        url: process.env.NODE_ENV === 'production'
          ? process.env.NEXT_PUBLIC_BASE_URL
          : `http://localhost:${PORT}`,
        description: process.env.NODE_ENV === 'production'
          ? 'Production server'
          : 'Local development server',
      },
    ],
  },
  apis: ['./routes/*.js'], // Path to the API docs
}
const swaggerSpecs = swaggerJSDoc(swaggerOptions)
// Use routes

//app.get('/', (req, res) => {
//  res.send('Welcome to the API')
//})
app.use('/api/users', userRoutes) // User routes
app.use('/api/tags', tagRoutes) // Tag routes
app.use('/api/recipes', recipeRoutes) // Recipe routes
app.use(
  '/api/docs/swagger',
  swaggerui.serve,
  swaggerui.setup(swaggerSpecs, { explorer: true })
) // Swagger API docs route
app.use('/api/docs/swagger.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json')
  res.send(swaggerSpecs)
})
app.get(
  '/api/docs/redoc',
  redoc({
    title: 'API Docs',
    specUrl: '/api/docs/swagger.json',
    nonce: '', // <= it is optional,we can omit this key and value
    // we are now start supporting the redocOptions object
    // you can omit the options object if you don't need it
    // https://redocly.com/docs/api-reference-docs/configuration/functionality/
    redocOptions: {
      theme: {
        colors: {
          primary: {
            main: '#6EC5AB',
          },
        },
        typography: {
          fontFamily:
            '"museo-sans", \'Helvetica Neue\', Helvetica, Arial, sans-serif',
          fontSize: '15px',
          lineHeight: '1.5',
          code: {
            code: '#87E8C7',
            backgroundColor: '#4D4D4E',
          },
        },
        menu: {
          backgroundColor: '#ffffff',
        },
      },
    },
  })
)



export default app // Export the app for use in other files
