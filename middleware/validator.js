/* eslint-disable no-console */
import { body, validationResult } from 'express-validator'
import { StatusCodes } from 'http-status-codes'
import { errorResponse } from '../utils/response.js'

export const userRegistrationRules = [
  body('email').notEmpty().isEmail().trim().isLength({ min: 5, max: 50 }),
  body('displayName')
    .notEmpty()
    .isString()
    .trim()
    .isLength({ min: 2, max: 50 }),
  body('password').notEmpty().isString().isLength({ min: 6, max: 50 }),
  body('confirmPassword').notEmpty().isString().isLength({ min: 6, max: 50 }),
]

export const userLoginRules = [
  body('email').notEmpty().isEmail().trim().isLength({ min: 5, max: 50 }),
  body('password').notEmpty().isString().isLength({ min: 6, max: 50 }),
]

export const userRefreshTokenRules = [
  body('refreshToken').notEmpty().isString().isUUID(),
]

const parseArrayField = (value) => {
  if (Array.isArray(value)) return value
  if (typeof value === 'string') {
    // Handle comma-separated or JSON-style strings
    try {
      const parsed = JSON.parse(value)
      if (Array.isArray(parsed)) return parsed
    } catch {
      // fallback: comma-separated
      return value.split(',').map(v => v.trim()).filter(Boolean)
    }
  }
  return []
}

export const recipeCreationRules = [
  body('title').notEmpty().isString().trim().isLength({ min: 2, max: 100 }),
  body('description')
    .notEmpty()
    .isString()
    .trim()
    .isLength({ min: 10, max: 500 }),
  body('ingredients')
    .notEmpty()
    .customSanitizer(parseArrayField)
    .isArray({ min: 1 })
    .withMessage('Ingredients must be a non-empty array or string list'),

  body('steps')
    .notEmpty()
    .customSanitizer(parseArrayField)
    .isArray({ min: 1 })
    .withMessage('Steps must be a non-empty array or string list'),

  body('tags')
    .optional()
    .customSanitizer(parseArrayField)
    .isArray()
    .withMessage('Tags must be an array or comma-separated string'),
  body('preparationTime').optional().isInt({ min: 1, max: 1440 }), // in minutes, max 24 hours
]
/*
export const recipeCreationRules = [
  body('title').notEmpty().isString().trim().isLength({ min: 2, max: 100 }),
  body('description')
    .notEmpty()
    .isString()
    .trim()
    .isLength({ min: 10, max: 500 }),
  body('ingredients').notEmpty().isArray({ min: 1 }),
  body('steps').notEmpty().isArray({ min: 1 }),
  body('tags').optional().isArray(), // Array of tag IDs
  body('preparationTime').optional().isInt({ min: 1, max: 1440 }), // in minutes, max 24 hours
]*/

export const validate = (req, res, next) => {
  // Write function better add custom error message for each validation
  const errors = validationResult(req)
  const errorsArray = []
  errors.array().map((err) => errorsArray.push({ [err.path]: err.msg }))
  console.log(errors)
  console.log(req.body)
  if (errors.isEmpty()) {
    return next()
  }
  return res
    .status(StatusCodes.UNPROCESSABLE_ENTITY)
    .json(errorResponse('Validation Error', errorsArray))
}
