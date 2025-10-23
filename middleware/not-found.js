// Route not found middleware
import { StatusCodes } from 'http-status-codes'
import { errorResponse } from '../utils/response.js'

function notFound(req, res, next) {
  return res
    .status(StatusCodes.NOT_FOUND)
    .json(errorResponse('Route not found'))
}

export default notFound
