import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'
import UserModel from '../models/user.model.js'
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
})

const baseUrl = '/api/users'

describe('User Routes Tests', async () => {
  describe('GET /api/users', async () => {
    it('should return 200 OK and JSON content type', async () => {
      await api
        .get(baseUrl)
        .expect(200)
        .expect('Content-Type', /application\/json/)
    })

    it('should list all users in the database', async () => {
      const response = await api.get(baseUrl)
      assert.strictEqual(response.body.data.length, mockUsers.length)
    })
  })

  describe('POST /api/users/', async () => {
    it('should create a new user with valid data', async () => {
      const newUser = {
        email: 'johndoe@email.com',
        displayName: 'John Doe',
        password: 'johndoe123',
        confirmPassword: 'johndoe123',
      }
      const response = await api.post(baseUrl).send(newUser).expect(201)
      assert.equal(response.body.data.email, newUser.email)
      assert.equal(response.body.data.displayName, newUser.displayName)
    })
    it('should return error status 400 if passwords don\'t match', async () => {
      const newUser = {
        email: 'johndoe@email.com',
        displayName: 'John Doe',
        password: 'johndoe123',
        confirmPassword: 'johndoe123456',
      }
      await api.post(baseUrl).send(newUser).expect(400)
    })
    it('should return error status 409 if a user with the same email already exists', async () => {
      const newUser = {
        email: 'jermainebrown@email.com',
        displayName: 'Jermaine Brown',
        password: 'jermainebrown123',
        confirmPassword: 'jermainebrown123',
      }
      await api.post(baseUrl).send(newUser).expect(409)
    })
  })

  describe('POST /api/users/register', async () => {
    it('should register a new user with valid data and return access and refresh tokens', async () => {
      const newUser = {
        email: 'johndoe@email.com',
        displayName: 'John Doe',
        password: 'johndoe123',
        confirmPassword: 'johndoe123',
      }
      const response = await api
        .post(`${baseUrl}/register`)
        .send(newUser)
        .expect(201)
      assert.ok(response.body.data.accessToken)
      assert.ok(response.body.data.refreshToken)
    })
  })

  describe('POST /api/users/login', async () => {
    it('should login an existing user with valid credentials and return access and refresh tokens', async () => {
      const loginCredentials = {
        email: 'jermainebrown@email.com',
        password: 'jermainebrown@email.com123',
      }
      const response = await api
        .post(`${baseUrl}/login`)
        .send(loginCredentials)
        .expect(200)
      assert.ok(response.body.data.accessToken)
      assert.ok(response.body.data.refreshToken)
    })
  })

  describe('POST /api/users/refresh', async () => {
    it('should issue new access token with valid refresh token', async () => {
      const loginCredentials = {
        email: 'jermainebrown@email.com',
        password: 'jermainebrown@email.com123',
      }
      const loginResponse = await api
        .post(`${baseUrl}/login`)
        .send(loginCredentials)
        .expect(200)
      const refreshToken = loginResponse.body.data.refreshToken

      const response = await api
        .post(`${baseUrl}/refresh`)
        .send({ refreshToken })
        .expect(200)
      assert.ok(response.body.data.accessToken)
      assert.ok(response.body.data.refreshToken)
    })

    it('should return error for refresh token of invalid format', async () => {
      await api
        .post(`${baseUrl}/refresh`)
        .send({ refreshToken: 'invalidtoken' })
        .expect(422)
    })
  })

  describe('POST /api/users/email/:email', async () => {
    it('should return user data for existing email', async () => {
      const email = 'jermainebrown@email.com'
      const response = await api.get(`${baseUrl}/email/${email}`).expect(200)
      assert.ok(response.body.data)
      assert.equal(response.body.data.email, email)
    })

    it('should return 404 for non-existing email', async () => {
      const email = 'nonexisting@email.com'
      await api.get(`${baseUrl}/email/${email}`).expect(404)
    })
  })

  describe('GET /api/users/me', async () => {
    it('should return the authenticated user\'s data', async () => {
      const loginCredentials = {
        email: 'jermainebrown@email.com',
        password: 'jermainebrown@email.com123',
      }
      const loginResponse = await api
        .post(`${baseUrl}/login`)
        .send(loginCredentials)
        .expect(200)
      const accessToken = loginResponse.body.data.accessToken

      const response = await api
        .get(`${baseUrl}/me`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
      assert.ok(response.body.data)
      assert.equal(response.body.data.email, loginCredentials.email)
    })

    it('should return 401 Unauthorized if no token is provided', async () => {
      await api.get(`${baseUrl}/me`).expect(401)
    })
  })
})
