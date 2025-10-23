import express from 'express'
import { listTags, getTag } from '../controllers/tag.controller.js'

const router = express.Router()

/**
 * @swagger
 * components:
 *   schemas:
 *     Tag:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "6708c0b70d7e2b4b68e413b2"
 *         name:
 *           type: string
 *           example: "Vegan"
 *         slug:
 *           type: string
 *           example: "vegan"
 *         recipes:
 *           type: array
 *           items:
 *             type: string
 *             example: "6708c22e0d7e2b4b68e413c1"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2025-10-19T12:34:56.789Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2025-10-19T12:34:56.789Z"
 */
/**
 * @swagger
 * /api/tags:
 *   get:
 *     summary: Retrieve all tags
 *     description: Returns a list of all tags available in the system.
 *     tags:
 *       - Tags
 *     responses:
 *       200:
 *         description: List of tags retrieved successfully.
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
 *                   example: Tags retrieved successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Tag'
 *       500:
 *         description: Internal server error.
 */
router.route('/').get(listTags)

/**
 * @swagger
 * components:
 *   schemas:
 *     Recipe:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "6710d1f80d7e2b4b68e413d3"
 *         title:
 *           type: string
 *           example: "Avocado Toast"
 *         description:
 *           type: string
 *           example: "A quick healthy breakfast with mashed avocado and bread."
 *         slug:
 *           type: string
 *           example: "avocado-toast"
 *         imageUrl:
 *           type: string
 *           example: "https://cdn.example.com/images/avocado-toast.jpg"
 *         creator:
 *           type: string
 *           example: "6708c0b70d7e2b4b68e413b2"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2025-10-19T12:34:56.789Z"
 */
/**
 * @swagger
 * components:
 *   schemas:
 *     TagWithRecipes:
 *       allOf:
 *         - $ref: '#/components/schemas/Tag'
 *         - type: object
 *           properties:
 *             recipes:
 *               type: array
 *               description: List of recipes associated with the tag.
 *               items:
 *                 $ref: '#/components/schemas/Recipe'
 */
/**
 * @swagger
 * /api/tags/{tagId}:
 *   get:
 *     summary: Get details of a specific tag
 *     description: Retrieve a single tag by its ID, including the list of recipes associated with it.
 *     tags:
 *       - Tags
 *     parameters:
 *       - in: path
 *         name: tagId
 *         required: true
 *         description: The unique ID of the tag to retrieve.
 *         schema:
 *           type: string
 *           example: "6708c0b70d7e2b4b68e413b2"
 *     responses:
 *       200:
 *         description: Tag retrieved successfully.
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
 *                   example: Tag retrieved successfully
 *                 data:
 *                   $ref: '#/components/schemas/TagWithRecipes'
 *       400:
 *         description: Tag ID is missing or invalid.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Tag ID is required
 *       404:
 *         description: Tag not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Tag not found
 *       500:
 *         description: Internal server error.
 */
router.route('/:tagId').get(getTag)

export default router