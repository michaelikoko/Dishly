/* eslint-disable no-console */

const recipes = [
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
    title: 'Beef Stir Fry',
    description:
      'Tender beef strips stir-fried with colorful vegetables and savory sauce.',
    ingredients: [
      'Beef strips',
      'Soy sauce',
      'Broccoli',
      'Carrots',
      'Garlic',
      'Ginger',
      'Sesame oil',
    ],
    steps: [
      'Marinate beef in soy sauce and ginger.',
      'Stir-fry beef until browned, then set aside.',
      'Cook vegetables until tender-crisp.',
      'Return beef to pan and toss with sauce.',
      'Serve hot over rice.',
    ],
    preparationTime: 30,
  },
  {
    title: 'Chicken Alfredo',
    description:
      'Creamy Alfredo pasta topped with juicy chicken breast. A comfort food favorite.',
    ingredients: [
      'Fettuccine pasta',
      'Chicken breast',
      'Heavy cream',
      'Butter',
      'Parmesan cheese',
      'Garlic',
      'Salt',
    ],
    steps: [
      'Cook pasta according to package directions.',
      'Sauté chicken until golden and cooked through.',
      'In a separate pan, melt butter and sauté garlic.',
      'Add cream and simmer until thickened.',
      'Stir in cheese and toss with pasta and chicken.',
      'Serve immediately.',
    ],
    preparationTime: 35,
  },
  {
    title: 'Vegetable Fried Rice',
    description:
      'A simple, quick, and delicious fried rice packed with vegetables.',
    ingredients: [
      'Cooked rice',
      'Carrots',
      'Peas',
      'Corn',
      'Soy sauce',
      'Sesame oil',
      'Eggs',
    ],
    steps: [
      'Scramble eggs in a hot pan and set aside.',
      'Sauté vegetables until tender.',
      'Add rice and soy sauce, stir-frying well.',
      'Mix in eggs and sesame oil.',
      'Serve warm.',
    ],
    preparationTime: 20,
  },
  {
    title: 'Classic Pancakes',
    description: 'Fluffy and delicious pancakes, perfect for breakfast.',
    ingredients: [
      'Flour',
      'Eggs',
      'Milk',
      'Baking powder',
      'Sugar',
      'Salt',
      'Butter',
    ],
    steps: [
      'Whisk dry ingredients together.',
      'Add milk and eggs, then mix until smooth.',
      'Heat butter on a skillet.',
      'Pour batter and cook until bubbles form.',
      'Flip and cook until golden brown.',
    ],
    preparationTime: 15,
  },
  {
    title: 'Tomato Basil Soup',
    description: 'A rich and creamy soup made with fresh tomatoes and basil.',
    ingredients: [
      'Tomatoes',
      'Garlic',
      'Onion',
      'Basil',
      'Olive oil',
      'Vegetable broth',
      'Cream',
    ],
    steps: [
      'Sauté onions and garlic until soft.',
      'Add tomatoes and broth, simmer for 20 minutes.',
      'Blend until smooth.',
      'Add cream and basil.',
      'Serve hot.',
    ],
    preparationTime: 40,
  },
  {
    title: 'BBQ Chicken Wings',
    description: 'Crispy wings tossed in smoky BBQ sauce. Ideal for parties.',
    ingredients: [
      'Chicken wings',
      'BBQ sauce',
      'Garlic powder',
      'Paprika',
      'Salt',
      'Black pepper',
    ],
    steps: [
      'Season wings with spices.',
      'Bake or fry until crispy.',
      'Toss in BBQ sauce.',
      'Serve with dipping sauce.',
    ],
    preparationTime: 45,
  },
  {
    title: 'Avocado Toast',
    description:
      'A quick and healthy toast topped with creamy avocado and seasonings.',
    ingredients: [
      'Bread slices',
      'Avocado',
      'Lemon juice',
      'Chili flakes',
      'Salt',
      'Olive oil',
    ],
    steps: [
      'Toast bread slices.',
      'Mash avocado with lemon juice and salt.',
      'Spread on toast.',
      'Top with chili flakes and drizzle olive oil.',
    ],
    preparationTime: 10,
  },
  {
    title: 'Grilled Cheese Sandwich',
    description:
      'Crispy golden bread with gooey melted cheese. Simple and classic.',
    ingredients: ['Bread', 'Butter', 'Cheddar cheese', 'Mozzarella cheese'],
    steps: [
      'Butter one side of each bread slice.',
      'Place cheese between slices.',
      'Grill until golden and cheese melts.',
      'Serve hot.',
    ],
    preparationTime: 12,
  },
  {
    title: 'Margarita Pizza',
    description:
      'A thin-crust pizza topped with tomato sauce, mozzarella, and fresh basil.',
    ingredients: [
      'Pizza dough',
      'Tomato sauce',
      'Mozzarella cheese',
      'Basil',
      'Olive oil',
      'Salt',
    ],
    steps: [
      'Preheat oven to 220°C.',
      'Spread sauce on dough.',
      'Add mozzarella and basil.',
      'Bake for 10–12 minutes.',
      'Drizzle with olive oil and serve.',
    ],
    preparationTime: 30,
  },
  {
    title: 'Banana Smoothie',
    description: 'A creamy and refreshing banana smoothie with milk and honey.',
    ingredients: ['Bananas', 'Milk', 'Honey', 'Ice cubes'],
    steps: [
      'Add all ingredients to blender.',
      'Blend until smooth.',
      'Pour into glasses and serve.',
    ],
    preparationTime: 5,
  },
  {
    title: 'Egg Fried Rice',
    description: 'Simple egg fried rice with soy sauce and scallions.',
    ingredients: [
      'Cooked rice',
      'Eggs',
      'Soy sauce',
      'Scallions',
      'Oil',
      'Salt',
    ],
    steps: [
      'Scramble eggs in hot pan.',
      'Add rice and soy sauce.',
      'Stir-fry until well combined.',
      'Top with scallions.',
    ],
    preparationTime: 15,
  },
  {
    title: 'French Toast',
    description:
      'Golden, soft bread soaked in a rich egg mixture and fried to perfection.',
    ingredients: ['Bread', 'Eggs', 'Milk', 'Sugar', 'Cinnamon', 'Butter'],
    steps: [
      'Whisk eggs, milk, sugar, and cinnamon.',
      'Dip bread slices in mixture.',
      'Fry in butter until golden.',
      'Serve with syrup.',
    ],
    preparationTime: 15,
  },
  {
    title: 'Tuna Salad',
    description:
      'A light and healthy tuna salad perfect for sandwiches or wraps.',
    ingredients: [
      'Canned tuna',
      'Mayonnaise',
      'Lettuce',
      'Onion',
      'Salt',
      'Black pepper',
    ],
    steps: [
      'Drain tuna.',
      'Mix with mayonnaise and seasoning.',
      'Add chopped lettuce and onions.',
      'Chill before serving.',
    ],
    preparationTime: 10,
  },
  {
    title: 'Omelette',
    description:
      'A fluffy, protein-packed omelette with cheese and vegetables.',
    ingredients: ['Eggs', 'Cheese', 'Bell peppers', 'Onions', 'Salt', 'Pepper'],
    steps: [
      'Whisk eggs with salt and pepper.',
      'Cook vegetables in a pan.',
      'Pour eggs over and cook until set.',
      'Add cheese and fold.',
      'Serve hot.',
    ],
    preparationTime: 10,
  },
  {
    title: 'Chicken Tacos',
    description: 'Flavorful chicken tacos with fresh toppings and zesty sauce.',
    ingredients: [
      'Tortillas',
      'Chicken breast',
      'Lettuce',
      'Tomatoes',
      'Sour cream',
      'Spices',
    ],
    steps: [
      'Cook chicken with spices.',
      'Warm tortillas.',
      'Assemble tacos with toppings.',
      'Serve immediately.',
    ],
    preparationTime: 25,
  },
  {
    title: 'Baked Salmon',
    description: 'Tender salmon fillet baked with lemon and herbs.',
    ingredients: [
      'Salmon fillet',
      'Lemon',
      'Garlic',
      'Parsley',
      'Olive oil',
      'Salt',
    ],
    steps: [
      'Preheat oven to 180°C.',
      'Season salmon with lemon, garlic, and herbs.',
      'Bake for 15–20 minutes.',
      'Serve warm.',
    ],
    preparationTime: 30,
  },
  {
    title: 'Chocolate Chip Cookies',
    description:
      'Crispy on the outside, chewy on the inside chocolate chip cookies.',
    ingredients: [
      'Flour',
      'Butter',
      'Sugar',
      'Brown sugar',
      'Eggs',
      'Chocolate chips',
      'Vanilla extract',
    ],
    steps: [
      'Cream butter and sugar together.',
      'Add eggs and vanilla.',
      'Stir in dry ingredients and chocolate chips.',
      'Scoop onto tray and bake at 180°C for 12 minutes.',
    ],
    preparationTime: 40,
  },
  {
    title: 'Caesar Salad',
    description:
      'Crisp romaine lettuce tossed with creamy Caesar dressing and croutons.',
    ingredients: [
      'Romaine lettuce',
      'Parmesan cheese',
      'Croutons',
      'Caesar dressing',
      'Lemon juice',
    ],
    steps: [
      'Toss lettuce with dressing.',
      'Add cheese and croutons.',
      'Serve chilled.',
    ],
    preparationTime: 10,
  },
  {
    title: 'Pesto Pasta',
    description:
      'A fragrant pasta dish with basil pesto sauce and Parmesan cheese.',
    ingredients: [
      'Pasta',
      'Basil pesto',
      'Parmesan cheese',
      'Olive oil',
      'Salt',
    ],
    steps: [
      'Cook pasta al dente.',
      'Toss with pesto and olive oil.',
      'Top with Parmesan.',
      'Serve warm.',
    ],
    preparationTime: 20,
  },
  {
    title: 'Fruit Parfait',
    description:
      'A light and colorful dessert with yogurt, fruits, and granola.',
    ingredients: ['Yogurt', 'Granola', 'Strawberries', 'Blueberries', 'Honey'],
    steps: [
      'Layer yogurt, fruits, and granola in a glass.',
      'Drizzle with honey.',
      'Serve chilled.',
    ],
    preparationTime: 5,
  },
  {
    title: 'Chicken Noodle Soup',
    description:
      'A warm and comforting chicken noodle soup with vegetables and herbs.',
    ingredients: [
      'Chicken breast',
      'Egg noodles',
      'Carrots',
      'Celery',
      'Garlic',
      'Broth',
      'Salt',
    ],
    steps: [
      'Boil chicken and shred.',
      'Sauté vegetables.',
      'Add broth and noodles.',
      'Simmer until cooked.',
      'Serve hot.',
    ],
    preparationTime: 45,
  },
  {
    title: 'Coconut Rice',
    description: 'Fragrant rice cooked with coconut milk for a rich flavor.',
    ingredients: ['Rice', 'Coconut milk', 'Salt', 'Water'],
    steps: [
      'Rinse rice thoroughly.',
      'Combine rice, coconut milk, water, and salt.',
      'Cook until fluffy.',
      'Serve warm.',
    ],
    preparationTime: 30,
    creator: '652f9b88f82e3a6f98a5b224',
  },
  {
    title: 'Apple Pie',
    description: 'A classic dessert with spiced apples baked in a flaky crust.',
    ingredients: [
      '2 pie crusts',
      '5 apples',
      '1/2 cup sugar',
      'Cinnamon',
      'Butter',
    ],
    steps: [
      'Prepare filling with apples and sugar.',
      'Fill crust and top with second crust.',
      'Bake until golden brown.',
    ],
    preparationTime: 70,
  },
  {
    title: 'Spicy Tomato Pasta',
    description:
      'A bold and flavorful pasta dish made with spicy tomato sauce and herbs.',
    ingredients: [
      'pasta',
      'olive oil',
      'garlic',
      'tomatoes',
      'chili flakes',
      'basil',
      'salt',
    ],
    steps: [
      'Boil pasta until al dente.',
      'Sauté garlic and chili flakes in olive oil.',
      'Add tomatoes and simmer for 10 minutes.',
      'Mix in pasta and season with salt and basil.',
    ],
    preparationTime: 25,
  },
  {
    title: 'Garlic Butter Shrimp',
    description:
      'Juicy shrimp sautéed in garlic butter and herbs for a simple yet elegant meal.',
    ingredients: [
      'shrimp',
      'butter',
      'garlic',
      'parsley',
      'lemon juice',
      'salt',
      'pepper',
    ],
    steps: [
      'Melt butter in a skillet.',
      'Add garlic and cook until fragrant.',
      'Add shrimp and cook for 3 minutes per side.',
      'Season and garnish with parsley and lemon.',
    ],
    preparationTime: 20,
  },
  {
    title: 'Coconut Curry Chicken',
    description:
      'A creamy and aromatic curry with tender chicken pieces and coconut milk.',
    ingredients: [
      'chicken breast',
      'onion',
      'garlic',
      'ginger',
      'coconut milk',
      'curry powder',
      'salt',
    ],
    steps: [
      'Sauté onion, garlic, and ginger.',
      'Add curry powder and cook briefly.',
      'Add chicken and cook until browned.',
      'Pour in coconut milk and simmer until thickened.',
    ],
    preparationTime: 40,
  },
  {
    title: 'Lemon Herb Salmon',
    description:
      'Oven-baked salmon seasoned with lemon, garlic, and herbs for a fresh, light meal.',
    ingredients: [
      'salmon fillet',
      'lemon',
      'garlic',
      'olive oil',
      'parsley',
      'salt',
      'pepper',
    ],
    steps: [
      'Preheat oven to 200°C.',
      'Mix lemon juice, olive oil, garlic, and herbs.',
      'Coat salmon and bake for 15–18 minutes.',
    ],
    preparationTime: 30,
  },
  {
    title: 'Creamy Mushroom Risotto',
    description:
      'Rich and creamy risotto made with mushrooms, Parmesan, and white wine.',
    ingredients: [
      'arborio rice',
      'mushrooms',
      'onion',
      'garlic',
      'white wine',
      'chicken broth',
      'Parmesan cheese',
    ],
    steps: [
      'Sauté onion and garlic.',
      'Add rice and toast for 2 minutes.',
      'Gradually add broth while stirring.',
      'Add mushrooms and cheese at the end.',
    ],
    preparationTime: 45,
  },
  {
    title: 'Avocado Toast Deluxe',
    description:
      'Crispy toast topped with mashed avocado, eggs, and chili flakes.',
    ingredients: [
      'bread',
      'avocado',
      'egg',
      'lemon juice',
      'chili flakes',
      'salt',
      'pepper',
    ],
    steps: [
      'Toast the bread.',
      'Mash avocado with lemon, salt, and pepper.',
      'Fry or poach egg.',
      'Assemble and top with chili flakes.',
    ],
    preparationTime: 10,
  },
  {
    title: 'Beef and Broccoli Stir Fry',
    description:
      'A quick Asian-inspired stir fry with tender beef slices and fresh broccoli.',
    ingredients: [
      'beef',
      'broccoli',
      'soy sauce',
      'ginger',
      'garlic',
      'cornstarch',
      'sesame oil',
    ],
    steps: [
      'Marinate beef in soy sauce and cornstarch.',
      'Stir-fry beef until browned.',
      'Add broccoli and sauce mixture.',
      'Cook for 5 minutes and serve.',
    ],
    preparationTime: 25,
  },
  {
    title: 'Classic Pancakes',
    description:
      'Fluffy pancakes perfect for breakfast, served with butter and syrup.',
    ingredients: [
      'flour',
      'milk',
      'egg',
      'baking powder',
      'sugar',
      'butter',
      'salt',
    ],
    steps: [
      'Mix dry ingredients.',
      'Add wet ingredients and whisk until smooth.',
      'Cook on a hot skillet until golden on both sides.',
    ],
    preparationTime: 15,
  },
  {
    title: 'Honey Garlic Chicken Wings',
    description:
      'Sticky and sweet chicken wings coated with a honey-garlic glaze.',
    ingredients: [
      'chicken wings',
      'honey',
      'soy sauce',
      'garlic',
      'ginger',
      'cornstarch',
    ],
    steps: [
      'Bake or fry chicken wings until crispy.',
      'Simmer honey, soy sauce, and garlic.',
      'Toss wings in the sauce until coated.',
    ],
    preparationTime: 35,
  },
  {
    title: 'Vegetable Fried Rice',
    description:
      'A colorful mix of rice and vegetables stir-fried with soy sauce and sesame oil.',
    ingredients: [
      'rice',
      'carrots',
      'peas',
      'eggs',
      'soy sauce',
      'sesame oil',
      'onion',
    ],
    steps: [
      'Scramble eggs and set aside.',
      'Sauté vegetables in oil.',
      'Add rice and soy sauce.',
      'Mix in eggs and toss well.',
    ],
    preparationTime: 20,
  },
  {
    title: 'Baked Mac and Cheese',
    description:
      'Creamy macaroni and cheese baked with a golden breadcrumb topping.',
    ingredients: [
      'macaroni',
      'milk',
      'cheddar cheese',
      'butter',
      'flour',
      'breadcrumbs',
      'salt',
    ],
    steps: [
      'Cook macaroni and drain.',
      'Make cheese sauce with butter, flour, and milk.',
      'Mix macaroni with sauce and top with breadcrumbs.',
      'Bake until golden brown.',
    ],
    preparationTime: 40,
  },
  {
    title: 'Greek Salad',
    description:
      'A refreshing salad with tomatoes, cucumbers, olives, and feta cheese.',
    ingredients: [
      'tomatoes',
      'cucumbers',
      'olives',
      'red onion',
      'feta cheese',
      'olive oil',
      'oregano',
    ],
    steps: [
      'Chop vegetables and combine in a bowl.',
      'Add olive oil and oregano.',
      'Top with feta cheese and mix gently.',
    ],
    preparationTime: 10,
  },
  {
    title: 'Chicken Alfredo Pasta',
    description:
      'Creamy Alfredo sauce served with fettuccine and grilled chicken strips.',
    ingredients: [
      'fettuccine',
      'chicken breast',
      'butter',
      'cream',
      'garlic',
      'Parmesan cheese',
      'salt',
    ],
    steps: [
      'Cook pasta and set aside.',
      'Cook chicken and slice.',
      'Prepare Alfredo sauce with butter, cream, and cheese.',
      'Combine pasta and chicken with sauce.',
    ],
    preparationTime: 35,
  },
  {
    title: 'Vegetable Soup',
    description: 'A hearty soup loaded with vegetables and aromatic herbs.',
    ingredients: [
      'carrots',
      'potatoes',
      'celery',
      'onion',
      'garlic',
      'tomatoes',
      'vegetable broth',
    ],
    steps: [
      'Sauté onions and garlic.',
      'Add chopped vegetables and broth.',
      'Simmer for 30 minutes and season to taste.',
    ],
    preparationTime: 45,
  },
  {
    title: 'Mango Smoothie Bowl',
    description:
      'A thick and creamy mango smoothie topped with fruits and granola.',
    ingredients: [
      'mango',
      'banana',
      'yogurt',
      'honey',
      'granola',
      'chia seeds',
    ],
    steps: [
      'Blend mango, banana, and yogurt.',
      'Pour into a bowl and top with granola and chia seeds.',
    ],
    preparationTime: 10,
  },
  {
    title: 'BBQ Pulled Pork Sandwich',
    description:
      'Tender shredded pork with BBQ sauce served on soft sandwich buns.',
    ingredients: [
      'pork shoulder',
      'BBQ sauce',
      'onion',
      'brown sugar',
      'buns',
      'salt',
    ],
    steps: [
      'Slow-cook pork with BBQ sauce and spices.',
      'Shred pork and mix with sauce.',
      'Serve on buns with onion slices.',
    ],
    preparationTime: 240,
  },
  {
    title: 'Caesar Salad',
    description:
      'Crisp romaine lettuce tossed with creamy Caesar dressing and croutons.',
    ingredients: [
      'romaine lettuce',
      'croutons',
      'Parmesan cheese',
      'Caesar dressing',
      'lemon juice',
    ],
    steps: [
      'Toss lettuce with dressing.',
      'Add croutons and Parmesan cheese.',
      'Drizzle lemon juice and serve.',
    ],
    preparationTime: 10,
  },
  {
    title: 'Vegetarian Chili',
    description:
      'A protein-packed chili made with beans, tomatoes, and spices.',
    ingredients: [
      'kidney beans',
      'black beans',
      'tomatoes',
      'onion',
      'garlic',
      'chili powder',
      'cumin',
    ],
    steps: [
      'Sauté onion and garlic.',
      'Add beans, tomatoes, and spices.',
      'Simmer for 45 minutes and adjust seasoning.',
    ],
    preparationTime: 60,
  },
  {
    title: 'Garlic Naan Bread',
    description: 'Soft Indian-style flatbread brushed with garlic butter.',
    ingredients: [
      'flour',
      'yogurt',
      'yeast',
      'sugar',
      'garlic',
      'butter',
      'salt',
    ],
    steps: [
      'Prepare dough and let rise.',
      'Roll out small rounds and cook on hot pan.',
      'Brush with garlic butter before serving.',
    ],
    preparationTime: 90,
  },
  {
    title: 'Stuffed Bell Peppers',
    description:
      'Colorful bell peppers filled with rice, beef, and tomato sauce.',
    ingredients: [
      'bell peppers',
      'rice',
      'ground beef',
      'tomato sauce',
      'onion',
      'garlic',
      'cheese',
    ],
    steps: [
      'Cook rice and beef mixture.',
      'Stuff bell peppers and top with sauce and cheese.',
      'Bake until peppers are tender.',
    ],
    preparationTime: 60,
  },
]

import RecipeModel from '../models/recipe.model.js'
import TagModel from '../models/tag.model.js'
import UserModel from '../models/user.model.js'
import dotenv from 'dotenv'
dotenv.config()
import process from 'process'
import mongoose from 'mongoose'
import { MONGODB_URI } from '../utils/config.js'

async function mockRecipes() {
  try {
    await mongoose.connect(MONGODB_URI)
    console.log('Connected to the database!')

    const existingUsers = await UserModel.find({}).exec()
    const existingTags = await TagModel.find({}).exec()

    let numRecipesAdded = 0
    const numOfRecipePerUser = Math.floor(recipes.length / existingUsers.length)

    //let recipesToInsert = []
    for (let i = 0; i < existingUsers.length; i++) {
      const start = i * numOfRecipePerUser
      const end = start + numOfRecipePerUser

      const userRecipes = recipes.slice(start, end)
      for (const recipe of userRecipes) {
        const randomTagInt1 = Math.floor(Math.random() * existingTags.length)
        const randomTagInt2 = Math.floor(Math.random() * existingTags.length)
        const randomTag1 = existingTags[randomTagInt1]
        const randomTag2 = existingTags[randomTagInt2]

        const createdRecipe = await RecipeModel.create({
          ...recipe,
          creator: existingUsers[i]._id,
          tags: [randomTag1._id, randomTag2._id]
        }) // Use the session in the create operation

        // I do this because Mongoose does not automatically update the other end of the many-to-many relationship
        existingTags[randomTagInt1].recipes.push(createdRecipe._id) // Add recipe to tag's recipes for tag 1
        existingTags[randomTagInt2].recipes.push(createdRecipe._id) // Add recipe to tag's recipes for tag 2
        await existingTags[randomTagInt1].save() // Save the updated tag 1
        await existingTags[randomTagInt2].save() // Save the updated tag 2

        numRecipesAdded += 1
      }
    }

    console.log(`${numRecipesAdded} new recipes added.`)

    await mongoose.disconnect()
    console.log('Disconnected from the database!')
    return process.exit(0)
  } catch (error) {
    console.error('Error seeding recipes:', error)
    return process.exit(1)
  }
}

mockRecipes()
