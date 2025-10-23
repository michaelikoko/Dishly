import express from 'express'
import {
  listUsers,
  createUser,
  registerUser,
  loginUser,
  refreshToken,
  me,
  getUserByEmail,
} from '../controllers/user.controllers.js'
import passport from '../middleware/passport.js'
import {
  userLoginRules,
  userRefreshTokenRules,
  userRegistrationRules,
  validate,
} from '../middleware/validator.js'

const router = express.Router()

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       description: A registered user
 *       properties:
 *         email:
 *           type: string
 *           description: The user's email address
 *           example: johndoe@example.com
 *         displayName:
 *           type: string
 *           description: The user's display name
 *           example: John Doe
 *       required:
 *         - id
 *         - email
 *         - displayName
 *
 *     NewUser:
 *       type: object
 *       description: New user registration data
 *       properties:
 *         email:
 *           type: string
 *           description: The user's email address
 *           example: johndoe@example.com
 *         displayName:
 *           type: string
 *           description: The display name of the user
 *           example: John Doe
 *         password:
 *           type: string
 *           format: password
 *           description: User's password
 *           example: "strongpassword123"
 *         confirmPassword:
 *           type: string
 *           format: password
 *           description: Must match the password field
 *           example: "strongpassword123"
 *       required:
 *         - email
 *         - displayName
 *         - password
 *         - confirmPassword
 *
 * tags:
 *   - name: Users
 *     description: Endpoints for user registration and management
 *
 * /api/users:
 *   get:
 *     summary: Retrieve a list of all registered users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Users retrieved successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Internal server error
 *
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NewUser'
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: User registered successfully
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Passwords do not match
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Passwords do not match
 *       409:
 *         description: User with this email already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: User with this email already exists
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Internal server error
 */
router
  .route('/')
  .get(listUsers)
  .post(userRegistrationRules, validate, createUser)

/**
 * @swagger
 * components:
 *   schemas:
 *     AuthTokens:
 *       type: object
 *       description: JWT access and refresh tokens issued upon registration
 *       properties:
 *         accessToken:
 *           type: string
 *           description: JWT access token used for authenticated requests
 *           example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *         refreshToken:
 *           type: string
 *           description: JWT refresh token used to obtain new access tokens
 *           example: 4f91e6d8b9b441a192cf12e38d72f840...
 *
 * tags:
 *   - name: Authentication
 *     description: Endpoints for user registration and token management
 *
 * /api/users/register:
 *   post:
 *     summary: Register a new user and receive JWT tokens
 *     description: Creates a new user account, validates input, hashes password, and issues access/refresh tokens.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NewUser'
 *     responses:
 *       201:
 *         description: User successfully registered and tokens issued
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: User created and login successful
 *                 data:
 *                   $ref: '#/components/schemas/AuthTokens'
 *       400:
 *         description: Passwords do not match or invalid input
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Passwords do not match
 *       409:
 *         description: User with this email already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: User with this email already exists
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Internal server error
 */
router.route('/register').post(userRegistrationRules, validate, registerUser)

/**
 * @swagger
 * components:
 *   schemas:
 *     LoginRequest:
 *       type: object
 *       description: User login credentials
 *       properties:
 *         email:
 *           type: string
 *           description: Registered email of the user
 *           example: johndoe@example.com
 *         password:
 *           type: string
 *           format: password
 *           description: User's password
 *           example: strongpassword123
 *       required:
 *         - email
 *         - password
 *
 * tags:
 *   - name: Authentication
 *     description: Endpoints for user authentication and token management
 *
 * /api/users/login:
 *   post:
 *     summary: Authenticate a user and return JWT tokens
 *     description: Validates user credentials, checks password, and returns access/refresh tokens on success.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Login successful
 *                 data:
 *                   $ref: '#/components/schemas/AuthTokens'
 *       401:
 *         description: Invalid email or password
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Invalid Email
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Internal server error
 */
router.route('/login').post(userLoginRules, validate, loginUser)

/**
 * @swagger
 * components:
 *   schemas:
 *     RefreshTokenRequest:
 *       type: object
 *       description: UUID refresh token used to request new access and refresh tokens
 *       properties:
 *         refreshToken:
 *           type: string
 *           format: uuid
 *           description: Valid refresh token UUID issued during login or registration
 *           example: "550e8400-e29b-41d4-a716-446655440000"
 *       required:
 *         - refreshToken
 *
 * tags:
 *   - name: Authentication
 *     description: Endpoints for user authentication and token renewal
 *
 * /api/users/refresh:
 *   post:
 *     summary: Issue new access and refresh tokens
 *     description: Validates a refresh token and returns new JWT tokens if the provided one is valid and unexpired.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RefreshTokenRequest'
 *     responses:
 *       200:
 *         description: New tokens issued successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: New access token issued
 *                 data:
 *                   $ref: '#/components/schemas/AuthTokens'
 *       400:
 *         description: Missing refresh token field
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Refresh token field is required
 *       401:
 *         description: Invalid or expired refresh token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Invalid refresh token
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Internal server error
 */
router.route('/refresh').post(userRefreshTokenRules, validate, refreshToken)

/**
 * @swagger
 * components:
 *   schemas:
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         message:
 *           type: string
 *           example: "User does not exist"
 *
 * @swagger
 * /api/users/email/{email}:
 *   get:
 *     summary: Get user by email
 *     description: Retrieve detailed user information, including their recipes, using the email parameter.
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *           format: email
 *         description: The email of the user to retrieve.
 *     responses:
 *       200:
 *         description: User retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: User retrieved successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "66e3413b2b7d3b001c2d1f09"
 *                     displayName:
 *                       type: string
 *                       example: "Michael Ikoko"
 *                     email:
 *                       type: string
 *                       example: "michael@example.com"
 *                     recipes:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           title:
 *                             type: string
 *                             example: "Homemade Pizza"
 *                           description:
 *                             type: string
 *                             example: "A delicious homemade pizza recipe."
 *                           slug:
 *                             type: string
 *                             example: "homemade-pizza"
 *                           tags:
 *                             type: array
 *                             items:
 *                               type: object
 *                               properties:
 *                                 _id:
 *                                   type: string
 *                                   example: 66e3413b2b7d3b001c2d1f09
 *                                 name:
 *                                   type: string
 *                                   example: "Italian"
 *                           imageUrl:
 *                             type: string
 *                             example: "https://cdn.example.com/images/pizza.jpg"
 *                           creator:
 *                             type: object
 *                             properties:
 *                               displayName:
 *                                 type: string
 *                                 example: "Michael Ikoko"
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                             example: "2025-10-20T15:32:12.000Z"
 *                           preparationTime:
 *                             type: string
 *                             example: "45 mins"
 *       400:
 *         description: Email parameter not provided.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: User not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error.
 *
 */
router.route('/email/:email').get(getUserByEmail)

/**
 * @swagger
 * /api/users/me:
 *   get:
 *     summary: Get authenticated user profile
 *     description: |
 *       Returns the profile of the authenticated user.
 *       Requires a valid **JWT access token** or **Basic Auth** credentials.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []        # JWT authentication
 *       - basicAuth: []         # Optional Basic authentication
 *     responses:
 *       200:
 *         description: Authenticated user profile retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: User verified
 *                 data:
 *                   type: object
 *                   properties:
 *                     email:
 *                       type: string
 *                       example: "michael@example.com"
 *                     displayName:
 *                       type: string
 *                       example: "Michael Ikoko"
 *       401:
 *         description: Unauthorized – missing or invalid credentials.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error.
 */
router
  .route('/me')
  .get(passport.authenticate(['jwt', 'basic'], { session: false }), me)

export default router
