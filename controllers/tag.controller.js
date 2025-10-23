import TagModel from '../models/tag.model.js'
import { successResponse, errorResponse } from '../utils/response.js'
import { StatusCodes } from 'http-status-codes'

export async function listTags(request, response) {
  // List all tags

  const tags = await TagModel.find({}).exec()
  return response
    .status(StatusCodes.OK)
    .json(successResponse('Tags retrieved successfully', tags))
}

export async function getTag(request, response) {
  // Get details of a single tag including list of recipes under it

  const tagId = request.params?.tagId

  if (!tagId) {
    return response
      .status(StatusCodes.BAD_REQUEST)
      .json(errorResponse('Tag ID is required'))
  }

  const tag = await TagModel.findById(tagId).populate('recipes').exec()
  if (!tag) {
    return response
      .status(StatusCodes.NOT_FOUND)
      .json(errorResponse('Tag not found'))
  }
  return response
    .status(StatusCodes.OK)
    .json(successResponse('Tag retrieved successfully', tag))
}

// I will add more tag related controllers here in the future like createTag, updateTag, deleteTag etc.
