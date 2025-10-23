import UserModel from '../models/user.model.js'
import { successResponse, errorResponse } from '../utils/response.js'
import { StatusCodes } from 'http-status-codes'
import {
  hashPassword,
  verifyRefreshTokenExpiration,
  comparePassword,
  issueAccessToken,
  createRefreshToken,
} from '../utils/helper.js'
import RefreshTokenModel from '../models/refresh-token.model.js'

export async function listUsers(request, response) {
  // List all users

  const users = await UserModel.find({}).exec()
  return response
    .status(StatusCodes.OK)
    .json(successResponse('Users retrieved successfully', users))
}

export async function createUser(request, response) {
  // Register a new user

  const { email, displayName, password, confirmPassword } = request.body

  // Check if password match
  if (password !== confirmPassword) {
    // Change and throw custom error here, and handle in error handler middleware
    return response
      .status(StatusCodes.BAD_REQUEST)
      .json(errorResponse('Passwords do not match'))
  }

  // Check if user with the same email already exists
  const existingUser = await UserModel.findOne({ email }).exec()
  if (existingUser) {
    return response
      .status(StatusCodes.CONFLICT)
      .json(errorResponse('User with this email already exists'))
  }

  // hash password
  const passwordHash = await hashPassword(password)

  // Create new user
  const newUser = await UserModel.create({
    email,
    passwordHash,
    displayName,
  })

  return response
    .status(StatusCodes.CREATED)
    .json(successResponse('User registered successfully', newUser))
}

export async function registerUser(request, response) {
  // Register a new user and return jwt tokens

  const { email, displayName, password, confirmPassword } = request.body

  // Check if password match
  if (password !== confirmPassword) {
    // Change and throw custom error here, and handle in error handler middleware
    return response
      .status(StatusCodes.BAD_REQUEST)
      .json(errorResponse('Passwords do not match'))
  }

  // Check if user with the same email already exists
  const existingUser = await UserModel.findOne({ email }).exec()
  if (existingUser) {
    return response
      .status(StatusCodes.CONFLICT)
      .json(errorResponse('User with this email already exists'))
  }

  // hash password
  const passwordHash = await hashPassword(password)

  // Create new user
  const newUser = await UserModel.create({
    email,
    passwordHash,
    displayName,
  })

  // jwt payload object
  const payload = {
    email: newUser.email,
    id: newUser.id,
  }

  const accessToken = await issueAccessToken(payload) // Issue access token
  const refreshToken = await createRefreshToken(newUser.id) // Create refresh token

  return response.status(StatusCodes.CREATED).json(
    successResponse('User created and login successful', {
      accessToken,
      refreshToken,
    })
  )
}

export async function loginUser(request, response) {
  // Login user and returns jwt token

  const { email, password } = request.body

  const user = await UserModel.findOne({ email }) // Find user in the database

  if (!user) {
    // Check if user exists
    return response
      .status(StatusCodes.UNAUTHORIZED)
      .json(errorResponse('Invalid Email'))
  }

  // Compare password to the saved hash
  const isPasswordCorrect = await comparePassword(password, user.passwordHash)

  // Check if password is valid
  if (!isPasswordCorrect) {
    return response
      .status(StatusCodes.UNAUTHORIZED)
      .json(errorResponse('Password is invalid'))
  }

  // jwt payload object
  const payload = {
    email: user.email,
    id: user.id,
  }

  const accessToken = await issueAccessToken(payload) // Issue access token
  const refreshToken = await createRefreshToken(user.id) // Create refresh token

  return response.status(StatusCodes.OK).json(
    successResponse('Login successful', {
      accessToken,
      refreshToken,
    })
  )
}

export async function refreshToken(request, response) {
  // Use refreshToken to get a new accessToken and another refreshToken
  const { refreshToken: refreshTokenUUID } = request.body // The UUID refreshToken string

  // Check if the field is provided
  if (!refreshTokenUUID) {
    return response
      .status(StatusCodes.BAD_REQUEST)
      .json(errorResponse('Refresh token field is required'))
  }

  // Find the refreshToken in the database
  const refreshToken = await RefreshTokenModel.findOne({
    token: refreshTokenUUID,
  }).populate('user')

  // Check if the refreshToken exists
  if (!refreshToken) {
    return response
      .status(StatusCodes.UNAUTHORIZED)
      .json(errorResponse('Invalid refresh token'))
  }

  // Check if the refreshToken is expired
  const isExpired = await verifyRefreshTokenExpiration(refreshToken)
  if (isExpired) {
    await RefreshTokenModel.findByIdAndDelete(refreshToken._id).exec() //Delete if expired
    return response
      .status(StatusCodes.UNAUTHORIZED)
      .json(errorResponse('Refresh token is expired'))
  }

  // Create new jwt payload
  const payload = {
    email: refreshToken.user.email,
    id: refreshToken.user.id,
  }

  // Delete the old refreshToken.
  await RefreshTokenModel.findByIdAndDelete(refreshToken._id).exec()

  // Issue new access and refresh tokens
  const newAccessToken = await issueAccessToken(payload)
  const newRefreshToken = await createRefreshToken(payload.id)

  return response.status(StatusCodes.OK).json(
    successResponse('New access token issued', {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    })
  )
}

export async function me(request, response) {
  // Returns the profile of the authenticated user

  return response
    .status(StatusCodes.OK)
    .json(successResponse('User verified', request.user))
}

export async function getUserByEmail(request, response) {
  // Returns details of the user that matches the email
  const email = request.params?.email
  if (!email) {
    return response
      .status(StatusCodes.BAD_REQUEST)
      .json(errorResponse('Email field cannot be empty'))
  }
  const user = await UserModel.findOne({ email: email }).populate({
    path: 'recipes',
    select:
      'title description slug tags imageUrl creator createdAt preparationTime',
    populate: [
      { path: 'tags', select: 'name' },
      { path: 'creator', select: 'displayName' },
    ],
  })

  if (!user) {
    return response
      .status(StatusCodes.NOT_FOUND)
      .json(errorResponse('User does not exist'))
  }
  return response
    .status(StatusCodes.OK)
    .json(successResponse('User retrieved successfully', user))
}
