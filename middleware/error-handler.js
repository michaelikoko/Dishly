/* eslint-disable no-console */
//Error Handler middleware
import { errorResponse } from '../utils/response.js'
import { StatusCodes } from 'http-status-codes'

function errorHandler(error, request, response, next) {
  //console.log('Error Handler Middleware Invoked')
  console.error(error.message)

  if (error.name === 'CastError') {
    return response
      .status(StatusCodes.BAD_REQUEST)
      .send(errorResponse('Malformatted id', error))
  } else if (error.name === 'ValidationError') {
    return response
      .status(StatusCodes.BAD_REQUEST)
      .send(errorResponse('Invalid input', error))
  } else {
    return response
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send(errorResponse('Internal Server Error', error))
  }

  next(error)
}

export default errorHandler
