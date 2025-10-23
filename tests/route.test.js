import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'
import UserModel from '../models/user.model.js'
import RecipeModel from '../models/recipe.model.js'
import app from '../app.js'
import supertest from 'supertest'
import process from 'process'
import assert from 'node:assert'
import { before, beforeEach, describe, after, it } from 'node:test'
import { hashPassword } from '../utils/helper.js'

const api = supertest(app)

before(async () => {
  // Set up in-memory MongoDB server
  const mongoServer = await MongoMemoryServer.create()
  const mongoTestUri = mongoServer.getUri()
  await mongoose.connect(mongoTestUri)
})

after(async () => {
  await mongoose.connection.close()
  process.exit(0)
})

const mockUsers = [
  {
    email: 'jermainebrown@email.com',
    displayName: 'Jermaine Brown',
  },
  {
    email: 'joycejohnson@email.com',
    displayName: 'Joyce Johnson',
  },
  {
    email: 'mayajamal@email.com',
    displayName: 'Maya Jamal',
  },
]

const slugify = (text) =>
  String(text)
    .toLowerCase()
    .trim()
    .replace(/&/g, '-and-')
    .replace(/[\s\W_]+/g, '-') // replace spaces and non-word chars with hyphen
    .replace(/^-+|-+$/g, '') // trim leading/trailing hyphens

const mockRecipes = [
  {
    title: 'Spaghetti Carbonara',
    description:
      'A classic Italian pasta dish with eggs, cheese, pancetta, and pepper. Quick and flavorful.',
    ingredients: [
      'Spaghetti',
      'Eggs',
      'Pancetta',
      'Parmesan cheese',
      'Black pepper',
      'Salt',
    ],
    steps: [
      'Cook spaghetti according to package instructions.',
      'Fry pancetta until crispy.',
      'Whisk eggs and cheese together in a bowl.',
      'Drain spaghetti and mix with pancetta.',
      'Remove from heat and add egg mixture, stirring quickly.',
      'Serve with extra cheese and pepper.',
    ],
    preparationTime: 25,
  },
  {
    title: 'Garlic Butter Shrimp',
    description:
      'Juicy shrimp cooked in rich garlic butter sauce. Perfect for a quick dinner.',
    ingredients: [
      'Shrimp',
      'Butter',
      'Garlic',
      'Lemon juice',
      'Parsley',
      'Salt',
      'Black pepper',
    ],
    steps: [
      'Melt butter in a skillet.',
      'Sauté garlic until fragrant.',
      'Add shrimp and cook until pink.',
      'Season with salt, pepper, and lemon juice.',
      'Garnish with parsley and serve.',
    ],
    preparationTime: 20,
  },
  {
    title: 'Chicken Tikka Masala',
    description:
      'Tender chicken pieces simmered in a creamy tomato sauce with Indian spices.',
    ingredients: [
      'Chicken breast',
      'Yogurt',
      'Tomato puree',
      'Onion',
      'Garlic',
      'Garam masala',
      'Cumin',
      'Coriander',
      'Cream',
      'Salt',
      'Pepper',
    ],
    steps: [
      'Marinate chicken in yogurt and spices.',
      'Grill or sauté chicken until cooked.',
      'Cook onions, garlic, and spices in a pan.',
      'Add tomato puree and simmer.',
      'Add chicken and cream, cook until thickened.',
      'Serve with rice or naan.',
    ],
    preparationTime: 40,
  },
  {
    title: 'Vegetable Stir Fry',
    description:
      'A quick and healthy mix of fresh vegetables sautéed in a savory sauce.',
    ingredients: [
      'Broccoli',
      'Carrots',
      'Bell peppers',
      'Snap peas',
      'Soy sauce',
      'Garlic',
      'Ginger',
      'Sesame oil',
      'Cornstarch',
      'Salt',
      'Pepper',
    ],
    steps: [
      'Chop all vegetables into bite-sized pieces.',
      'Heat sesame oil in a wok.',
      'Add garlic and ginger, sauté until fragrant.',
      'Add vegetables and stir fry until crisp-tender.',
      'Mix soy sauce and cornstarch, pour over veggies.',
      'Cook until sauce thickens, serve hot.',
    ],
    preparationTime: 15,
  },
  {
    title: 'Classic Beef Tacos',
    description:
      'Seasoned ground beef served in crispy taco shells with fresh toppings.',
    ingredients: [
      'Ground beef',
      'Taco shells',
      'Onion',
      'Garlic',
      'Chili powder',
      'Cumin',
      'Paprika',
      'Lettuce',
      'Tomato',
      'Cheddar cheese',
      'Sour cream',
      'Salt',
      'Pepper',
    ],
    steps: [
      'Cook ground beef with onions and garlic.',
      'Add spices and simmer.',
      'Fill taco shells with beef mixture.',
      'Top with lettuce, tomato, cheese, and sour cream.',
      'Serve immediately.',
    ],
    preparationTime: 20,
  },
  {
    title: 'Pancakes',
    description: 'Fluffy homemade pancakes perfect for breakfast or brunch.',
    ingredients: [
      'Flour',
      'Baking powder',
      'Sugar',
      'Salt',
      'Egg',
      'Milk',
      'Butter',
      'Vanilla extract',
    ],
    steps: [
      'Mix dry ingredients in a bowl.',
      'Whisk wet ingredients in another bowl.',
      'Combine wet and dry ingredients.',
      'Heat a skillet and add butter.',
      'Pour batter and cook until bubbles form.',
      'Flip and cook until golden brown.',
      'Serve with syrup.',
    ],
    preparationTime: 15,
  },
  {
    title: 'Caesar Salad',
    description:
      'Crisp romaine lettuce tossed with creamy Caesar dressing, croutons, and parmesan.',
    ingredients: [
      'Romaine lettuce',
      'Croutons',
      'Parmesan cheese',
      'Caesar dressing',
      'Lemon juice',
      'Black pepper',
    ],
    steps: [
      'Chop romaine lettuce.',
      'Toss lettuce with Caesar dressing.',
      'Add croutons and parmesan cheese.',
      'Drizzle with lemon juice and sprinkle pepper.',
      'Serve chilled.',
    ],
    preparationTime: 10,
  },
  {
    title: 'Tomato Basil Soup',
    description: 'A comforting soup made with ripe tomatoes and fresh basil.',
    ingredients: [
      'Tomatoes',
      'Onion',
      'Garlic',
      'Vegetable broth',
      'Basil',
      'Olive oil',
      'Salt',
      'Pepper',
      'Cream',
    ],
    steps: [
      'Sauté onions and garlic in olive oil.',
      'Add chopped tomatoes and cook until soft.',
      'Pour in vegetable broth and simmer.',
      'Blend soup until smooth.',
      'Stir in cream and fresh basil.',
      'Season with salt and pepper.',
      'Serve hot.',
    ],
    preparationTime: 30,
  },
  {
    title: 'Grilled Cheese Sandwich',
    description:
      'Golden, crispy bread with melted cheese inside. A classic comfort food.',
    ingredients: ['Bread slices', 'Butter', 'Cheddar cheese'],
    steps: [
      'Butter one side of each bread slice.',
      'Place cheese between unbuttered sides.',
      'Grill in a skillet until golden brown on both sides.',
      'Serve warm.',
    ],
    preparationTime: 10,
  },
  {
    title: 'Greek Salad',
    description:
      'A refreshing salad with cucumbers, tomatoes, olives, feta, and a tangy dressing.',
    ingredients: [
      'Cucumber',
      'Tomatoes',
      'Red onion',
      'Kalamata olives',
      'Feta cheese',
      'Olive oil',
      'Red wine vinegar',
      'Oregano',
      'Salt',
      'Pepper',
    ],
    steps: [
      'Chop vegetables and combine in a bowl.',
      'Add olives and feta cheese.',
      'Whisk olive oil, vinegar, oregano, salt, and pepper.',
      'Pour dressing over salad and toss.',
      'Serve chilled.',
    ],
    preparationTime: 12,
  },
].map((r) => ({ ...r, slug: slugify(r.title) }))

beforeEach(async () => {
  // Clear and populate the database before each test
  await UserModel.deleteMany({})
  const mockUserObjects = await Promise.all(
    mockUsers.map(async (user) => {
      const passwordHash = await hashPassword(`${user.email}123`)
      return {
        ...user,
        passwordHash: passwordHash,
      }
    })
  )
  await UserModel.insertMany(mockUserObjects)
  const creatorUser = await UserModel.findOne({
    email: 'jermainebrown@email.com',
  }).exec()
  const recipesWithCreator = mockRecipes.map((recipe) => {
    return {
      ...recipe,
      creator: creatorUser._id,
    }
  })
  // Jermaine Brown is the creator of all mock recipes
  await RecipeModel.deleteMany({})
  await RecipeModel.insertMany(recipesWithCreator)
})

const baseUrl = '/api/recipes'

describe('Recipe Routes Tests', async () => {
  describe('GET /api/recipes', async () => {
    it('should return 200 OK and JSON content type', async () => {
      await api.get(baseUrl).expect(200).expect('Content-Type', /json/)
    })
    it('should return a list of recipes with default length 8 with no query params passed', async () => {
      const response = await api.get(baseUrl).expect(200)
      assert.equal(response.body.data.docs.length, 8)
    })
  })

  describe('GET /api/recipes/slug/:slug', async () => {
    it('should return a valid recipe for a valid slug', async () => {
      const validSlug = 'caesar-salad'
      const response = await api.get(`${baseUrl}/slug/${validSlug}`).expect(200)
      assert.equal(response.body.data.title, 'Caesar Salad')
    })

    it('should return 404 Not Found for an invalid slug', async () => {
      const invalidSlug = 'non-existent-recipe-slug'
      await api.get(`${baseUrl}/slug/${invalidSlug}`).expect(404)
    })
  })

  describe('DEL /api/recipes/slug/:slug', async () => {
    it('should delete a recipe for a valid slug with authentication', async () => {
      const loginResponse = await api.post('/api/users/login').send({
        email: 'jermainebrown@email.com',
        password: 'jermainebrown@email.com123',
      })
      const accessToken = loginResponse.body.data.accessToken
      const validSlug = 'caesar-salad'
      const response = await api
        .delete(`${baseUrl}/slug/${validSlug}`)
        .set('Authorization', `Bearer ${accessToken}`)
      assert.equal(response.status, 204)
    })

    it('should return 404 Not Found when trying to delete a non-existent recipe', async () => {
      const loginResponse = await api.post('/api/users/login').send({
        email: 'jermainebrown@email.com',
        password: 'jermainebrown@email.com123',
      })
      const accessToken = loginResponse.body.data.accessToken
      const invalidSlug = 'non-existent-recipe-slug'
      await api
        .delete(`${baseUrl}/slug/${invalidSlug}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404)
    })

    it('should return 401 Unauthorized when no authentication is provided', async () => {
      const validSlug = 'caesar-salad'
      await api.delete(`${baseUrl}/slug/${validSlug}`).expect(401)
    })

    it('should return unauthorized when a user tries to delete a recipe they did not create', async () => {
      const loginResponse = await api.post('/api/users/login').send({
        email: 'mayajamal@email.com',
        password: 'mayajamal@email.com123',
      })
      const accessToken = loginResponse.body.data.accessToken
      const validSlug = 'caesar-salad'
      await api
        .delete(`${baseUrl}/slug/${validSlug}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(401)
    })
  })

  describe('GET /api/recipes/recent', async () => {
    it('should return 200 OK and JSON content type', async () => {
      await api.get(`${baseUrl}/recent`).expect(200).expect('Content-Type', /json/)
    })

    it('should return a list of recent recipes', async () => {
      const response = await api.get(`${baseUrl}/recent`).expect(200)
      assert(Array.isArray(response.body.data))
      assert.equal(response.body.data.length, 6)
    })
  })

  describe('GET /api/recipes/me', async () => {
    it('should return the authenticated user\'s recipes', async () => {
      const loginResponse = await api.post('/api/users/login').send({
        email: 'jermainebrown@email.com',
        password: 'jermainebrown@email.com123',
      })
      const accessToken = loginResponse.body.data.accessToken
      const response = await api
        .get(`${baseUrl}/me`)
        .set('Authorization', `Bearer ${accessToken}`)
      assert.equal(response.status, 200)
      assert(Array.isArray(response.body.data))
      assert.equal(response.body.data.length, mockRecipes.length) // Jermaine created all mock recipes
    })
  })
})
/*
  describe('POST /api/recipes', async () => {
    it('should create a new recipe with valid data and authentication', async () => {
      const loginResponse = await api.post('/api/users/login').send({
        email: 'jermainebrown@email.com',
        password: 'jermainebrown@email.com123',
      })
      const accessToken = loginResponse.body.data.accessToken
      const response = await api
        .post(baseUrl)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          title: 'New Recipe',
          description: 'Delicious new recipe',
          ingredients: ['Ingredient 1', 'Ingredient 2'],
          steps: ['Step 1', 'Step 2'],
          preparationTime: 15,
        })
      console.log(response.body)
      assert.equal(response.status, 201)
      assert.equal(response.body.data.title, 'New Recipe')
    })
  })
*/
