import express from 'express'
import {
  getRecipes,
  createRecipe,
  getRecipeBySlug,
  getRecentRecipes,
  getAuthUserRecipes,
  deleteRecipeBySlug,
  bookmarkRecipe,
  getAuthUserBookmarkedRecipes,
  unbookmarkRecipe,
  clearBookmarkedRecipes,
  generateAIRecipe,
} from '../controllers/recipe.controller.js'
import passport from '../middleware/passport.js'
import { recipeCreationRules, validate } from '../middleware/validator.js'
import { optionalAuthenticate } from '../middleware/passport.js'
import { upload } from '../utils/image.js'

const router = express.Router()

/**
 * @swagger
 * components:
 *   schemas:
 *     Recipe:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "6708c0b70d7e2b4b68e413b2"
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
 *           example: "https://res.cloudinary.com/dishly/recipes/avocado-toast.jpg"
 *         ingredients:
 *           type: array
 *           items:
 *             type: string
 *           example: ["2 slices of bread", "1 ripe avocado", "Salt"]
 *         steps:
 *           type: array
 *           items:
 *             type: string
 *           example: ["Toast bread", "Mash avocado", "Spread on toast"]
 *         preparationTime:
 *           type: integer
 *           example: 10
 *         creator:
 *           $ref: '#/components/schemas/User'
 *         tags:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Tag'
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2025-10-20T10:30:00Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2025-10-20T11:00:00Z"
 */
/**
 * @swagger
 * /api/recipes:
 *   get:
 *     summary: Retrieve a paginated list of recipes
 *     description: Returns a paginated, optionally filtered list of recipes. Supports filtering by tags, sorting, and pagination.
 *     tags:
 *       - Recipes
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 8
 *         description: Number of recipes per page.
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [title_asc, title_desc, prep_asc, prep_desc]
 *         description: Sort option for recipes. Defaults to newest first.
 *       - in: query
 *         name: tags
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *           example: ["breakfast", "quick-meals"]
 *         style: form
 *         explode: true
 *         description: Filter recipes by tag slugs.
 *     responses:
 *       200:
 *         description: Recipes retrieved successfully.
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
 *                   example: Recipes retrieved successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     docs:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Recipe'
 *                     totalDocs:
 *                       type: integer
 *                       example: 42
 *                     limit:
 *                       type: integer
 *                       example: 8
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     totalPages:
 *                       type: integer
 *                       example: 6
 *       500:
 *         description: Internal server error.
 *
 *   post:
 *     summary: Create a new recipe
 *     description: Create a new recipe (with image upload) associated with the authenticated user. Requires authentication.
 *     tags:
 *       - Recipes
 *     security:
 *       - bearerAuth: []
 *       - basicAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - ingredients
 *               - steps
 *               - image
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Avocado Toast"
 *               description:
 *                 type: string
 *                 example: "A quick and healthy breakfast with mashed avocado and bread."
 *               ingredients:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["2 slices of bread", "1 ripe avocado", "Salt"]
 *               steps:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Toast the bread", "Mash the avocado", "Spread avocado on toast"]
 *               preparationTime:
 *                 type: integer
 *                 example: 10
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["breakfast", "healthy"]
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Image file for the recipe.
 *     responses:
 *       201:
 *         description: Recipe created successfully.
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
 *                   example: Recipe created successfully
 *                 data:
 *                   $ref: '#/components/schemas/Recipe'
 *       400:
 *         description: Validation error or missing image.
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
 *                   example: Image is required
 *       401:
 *         description: Unauthorized. Missing or invalid JWT.
 *       500:
 *         description: Internal server error.
 */
router
  .route('/')
  .get(getRecipes)
  .post(
    upload.single('image'),
    recipeCreationRules,
    validate,
    passport.authenticate(['jwt', 'basic'], { session: false }),
    createRecipe
  )

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *     basicAuth:
 *       type: http
 *       scheme: basic
 */
/**
 * @swagger
 * /api/recipes/slug/{slug}:
 *   get:
 *     summary: Retrieve a recipe by its slug
 *     description: >
 *       Retrieves a single recipe by its slug.
 *       Authentication is optional — if the user is authenticated, the response will include a flag indicating whether the recipe is bookmarked by the user.
 *     tags:
 *       - Recipes
 *     security:
 *       - bearerAuth: []
 *       - basicAuth: []
 *       - {}
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *           example: "avocado-toast"
 *         description: Unique slug of the recipe.
 *     responses:
 *       200:
 *         description: Recipe retrieved successfully.
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
 *                   example: Recipe retrieved successfully
 *                 data:
 *                   allOf:
 *                     - $ref: '#/components/schemas/Recipe'
 *                     - type: object
 *                       properties:
 *                         isBookmarked:
 *                           type: boolean
 *                           example: true
 *       400:
 *         description: Slug not provided.
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
 *                   example: Slug is required
 *       404:
 *         description: Recipe not found.
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
 *                   example: Slug does not match any recipe in the database
 *       500:
 *         description: Internal server error.
 *
 *   delete:
 *     summary: Delete a recipe by its slug
 *     description: >
 *       Deletes a recipe identified by its slug.
 *       Only the creator of the recipe can delete it.
 *       Requires authentication using either JWT or Basic strategy.
 *     tags:
 *       - Recipes
 *     security:
 *       - bearerAuth: []
 *       - basicAuth: []
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *           example: "avocado-toast"
 *         description: Unique slug of the recipe.
 *     responses:
 *       204:
 *         description: Recipe deleted successfully. No content returned.
 *       400:
 *         description: Slug not provided.
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
 *                   example: Slug is required
 *       401:
 *         description: Unauthorized. The recipe does not belong to the authenticated user or invalid credentials were provided.
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
 *                   example: Unauthorized
 *       404:
 *         description: Recipe not found.
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
 *                   example: Slug does not match any recipe in the database
 *       500:
 *         description: Internal server error.
 */
router
  .route('/slug/:slug')
  .get(optionalAuthenticate, getRecipeBySlug)
  .delete(
    passport.authenticate(['jwt', 'basic'], { session: false }),

    deleteRecipeBySlug
  )

/**
 * @swagger
 * /api/recipes/recent:
 *   get:
 *     summary: Retrieve the most recent recipes
 *     description: >
 *       Fetches the six most recently created recipes, sorted in descending order by creation date.
 *       This endpoint is public and does not require authentication.
 *     tags:
 *       - Recipes
 *     responses:
 *       200:
 *         description: Recent recipes retrieved successfully.
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
 *                   example: Recent recipes retrieved successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: 6714951a13bcaf8e149df2e9
 *                       title:
 *                         type: string
 *                         example: "Spaghetti Carbonara"
 *                       description:
 *                         type: string
 *                         example: "A classic Italian pasta dish made with eggs, cheese, pancetta, and pepper."
 *                       slug:
 *                         type: string
 *                         example: "spaghetti-carbonara"
 *                       tags:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             _id:
 *                               type: string
 *                               example: 6714912a13bcaf8e149deae1
 *                             name:
 *                               type: string
 *                               example: "Italian"
 *                       imageUrl:
 *                         type: string
 *                         example: "https://example.com/images/spaghetti.jpg"
 *                       creator:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             example: 671492ba13bcaf8e149df111
 *                           displayName:
 *                             type: string
 *                             example: "John Doe"
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-10-18T19:21:36.123Z"
 *                       preparationTime:
 *                         type: number
 *                         example: 25
 *       500:
 *         description: Internal server error.
 */
router.route('/recent').get(getRecentRecipes)

/**
 * @swagger
 * /api/recipes/me:
 *   get:
 *     summary: Retrieve recipes created by the authenticated user
 *     description: >
 *       Returns all recipes authored by the currently authenticated user.
 *       Requires authentication using **JWT** or **Basic** strategy.
 *     tags:
 *       - Recipes
 *     security:
 *       - bearerAuth: []
 *       - basicAuth: []
 *     responses:
 *       200:
 *         description: User recipes retrieved successfully.
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
 *                   example: User recipes retrieved successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: 6714951a13bcaf8e149df2e9
 *                       title:
 *                         type: string
 *                         example: "Homemade Garlic Bread"
 *                       description:
 *                         type: string
 *                         example: "Crispy, buttery garlic bread made from scratch."
 *                       slug:
 *                         type: string
 *                         example: "homemade-garlic-bread"
 *                       tags:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             _id:
 *                               type: string
 *                               example: 6714912a13bcaf8e149deae1
 *                             name:
 *                               type: string
 *                               example: "Snacks"
 *                       imageUrl:
 *                         type: string
 *                         example: "https://res.cloudinary.com/dishly/recipes/garlic-bread.jpg"
 *                       creator:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             example: 671492ba13bcaf8e149df111
 *                           displayName:
 *                             type: string
 *                             example: "Michael Ikoko"
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-10-18T19:21:36.123Z"
 *                       preparationTime:
 *                         type: number
 *                         example: 15
 *       401:
 *         description: Unauthorized — missing or invalid credentials.
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
 *                   example: Unauthorized
 *       500:
 *         description: Internal server error.
 */
router
  .route('/me')
  .get(
    passport.authenticate(['jwt', 'basic'], { session: false }),
    getAuthUserRecipes
  )

/**
 * @swagger
 * /api/recipes/bookmark/me:
 *   get:
 *     summary: Retrieve bookmarked recipes of the authenticated user
 *     description: >
 *       Returns all recipes that the currently authenticated user has bookmarked.
 *       Requires authentication using **JWT** or **Basic** strategy.
 *     tags:
 *       - Bookmarks
 *     security:
 *       - bearerAuth: []
 *       - basicAuth: []
 *     responses:
 *       200:
 *         description: Bookmarked recipes retrieved successfully.
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
 *                   example: Bookmarked recipes retrieved successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: 6714951a13bcaf8e149df2e9
 *                       title:
 *                         type: string
 *                         example: "Spaghetti Carbonara"
 *                       description:
 *                         type: string
 *                         example: "A creamy Italian pasta dish with eggs, cheese, pancetta, and pepper."
 *                       slug:
 *                         type: string
 *                         example: "spaghetti-carbonara"
 *                       tags:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             _id:
 *                               type: string
 *                               example: 6714912a13bcaf8e149deae1
 *                             name:
 *                               type: string
 *                               example: "Pasta"
 *                       imageUrl:
 *                         type: string
 *                         example: "https://res.cloudinary.com/dishly/recipes/carbonara.jpg"
 *                       creator:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             example: 671492ba13bcaf8e149df111
 *                           displayName:
 *                             type: string
 *                             example: "Michael Ikoko"
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-10-18T19:21:36.123Z"
 *                       preparationTime:
 *                         type: number
 *                         example: 20
 *       401:
 *         description: Unauthorized — missing or invalid credentials.
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
 *                   example: Unauthorized
 *       500:
 *         description: Internal server error.
 */
router
  .route('/bookmark/me')
  .get(
    passport.authenticate(['jwt', 'basic'], { session: false }),
    getAuthUserBookmarkedRecipes
  )

/**
 * @swagger
 * /api/recipes/bookmark/me/clear:
 *   delete:
 *     summary: Clear all bookmarked recipes for the authenticated user
 *     description: Removes all recipes from the user's bookmark list and updates corresponding recipe documents to remove the user from their `bookmarkedBy` field.
 *     tags:
 *       - Bookmarks
 *     security:
 *       - bearerAuth: []
 *       - basicAuth: []
 *     responses:
 *       200:
 *         description: All bookmarked recipes cleared successfully.
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
 *                   example: All bookmarked recipes cleared successfully
 *       401:
 *         description: Unauthorized — missing or invalid authentication credentials.
 *       500:
 *         description: Internal server error — failed to clear bookmarked recipes.
 */
router
  .route('/bookmark/me/clear')
  .delete(
    passport.authenticate(['jwt', 'basic'], { session: false }),
    clearBookmarkedRecipes
  )

/**
 * @swagger
 * /api/recipes/bookmark/me/{slug}:
 *   put:
 *     summary: Bookmark a recipe
 *     description: Adds the specified recipe to the authenticated user's bookmarks, and adds the user to the recipe's `bookmarkedBy` list.
 *     tags:
 *       - Bookmarks
 *     security:
 *       - bearerAuth: []
 *       - basicAuth: []
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: The slug of the recipe to bookmark.
 *         example: "spaghetti-carbonara"
 *     responses:
 *       200:
 *         description: Recipe bookmarked successfully.
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
 *                   example: Recipe bookmarked successfully
 *       400:
 *         description: Slug is required.
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
 *                   example: Slug is required
 *       404:
 *         description: Recipe not found.
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
 *                   example: Slug does not match any recipe in the database
 *       401:
 *         description: Unauthorized — missing or invalid authentication credentials.
 *       500:
 *         description: Internal server error.
 *
 *   delete:
 *     summary: Unbookmark a recipe
 *     description: Removes the specified recipe from the authenticated user's bookmarks, and removes the user from the recipe's `bookmarkedBy` list.
 *     tags:
 *       - Bookmarks
 *     security:
 *       - bearerAuth: []
 *       - basicAuth: []
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: The slug of the recipe to unbookmark.
 *         example: "spaghetti-carbonara"
 *     responses:
 *       200:
 *         description: Recipe unbookmarked successfully.
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
 *                   example: Recipe unbookmarked successfully
 *       400:
 *         description: Slug is required.
 *       404:
 *         description: Recipe not found.
 *       401:
 *         description: Unauthorized — missing or invalid authentication credentials.
 *       500:
 *         description: Internal server error.
 */
router
  .route('/bookmark/me/:slug')
  .put(
    passport.authenticate(['jwt', 'basic'], { session: false }),
    bookmarkRecipe
  )
  .delete(
    passport.authenticate(['jwt', 'basic'], { session: false }),
    unbookmarkRecipe
  )

/**
 * @swagger
 * /api/recipes/ai:
 *   post:
 *     summary: Generate a recipe using AI
 *     description: |
 *       Generates a clear and realistic recipe in JSON format based on the user's textual prompt.
 *       If the prompt is unrelated to cooking or food, the AI returns an object containing only an `error` field.
 *     tags:
 *       - AI
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - prompt
 *             properties:
 *               prompt:
 *                 type: string
 *                 description: The user's text describing the desired recipe or food request.
 *                 example: "A vegan pasta recipe with avocado sauce"
 *     responses:
 *       200:
 *         description: AI recipe generated successfully.
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
 *                   example: AI recipe generated successfully
 *                 data:
 *                   oneOf:
 *                     - type: object
 *                       properties:
 *                         title:
 *                           type: string
 *                           example: Creamy Avocado Vegan Pasta
 *                         description:
 *                           type: string
 *                           example: A smooth and creamy pasta dish made with ripe avocados and lemon.
 *                         tags:
 *                           type: array
 *                           items:
 *                             type: string
 *                           example: ["AI", "Vegan", "Pasta"]
 *                         ingredients:
 *                           type: array
 *                           items:
 *                             type: string
 *                           example:
 *                             - 200g spaghetti
 *                             - 1 ripe avocado
 *                             - 2 tbsp olive oil
 *                             - 1 clove garlic
 *                         steps:
 *                           type: array
 *                           items:
 *                             type: string
 *                           example:
 *                             - Boil the spaghetti in salted water.
 *                             - Blend avocado, garlic, and olive oil until smooth.
 *                             - Mix with pasta and serve warm.
 *                         preparationTime:
 *                           type: integer
 *                           example: 20
 *                         error:
 *                           type: string
 *                           example: ""
 *                     - type: object
 *                       properties:
 *                         error:
 *                           type: string
 *                           example: "This request is not related to food or recipes."
 *       400:
 *         description: Prompt is required.
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
 *                   example: Prompt is required
 *       500:
 *         description: Internal server error.
 */
router.post('/ai', generateAIRecipe)

export default router
