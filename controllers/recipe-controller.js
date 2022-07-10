const User = require("../model/users-schema");
const Recipe = require("../model/recipe-schema");
const { mongoose } = require("mongoose");

const addRecipe = async (req, res, next) => {
  const userId = req.id;
  const { title, description, images, ingredients, mealType, timeToCook } =
    req.body;
  let existingUser;
  try {
    existingUser = await User.findById(userId);
  } catch (err) {
    return res.status(500).json({ message: "Error finding user" });
  }
  if (!existingUser) {
    return res.status(400).json({ message: "User Invalid" });
  }
  const recipe = new Recipe({
    title,
    description,
    images,
    ingredients,
    mealType,
    timeToCook,
    user: userId,
  });
  try {
    const session = await mongoose.startSession();
    session.startTransaction();
    await recipe.save({ session });
    existingUser.recipes.push(recipe);
    await existingUser.save({ session });
    await session.commitTransaction();
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: err });
  }
  return res.status(201).json({ recipe });
};

const getAllRecipes = async (req, res, next) => {
  let recipes;
  try {
    recipes = await Recipe.find();
  } catch (err) {
    return res.status(500).json({ message: "Error retriving recipes" });
  }
  if (!recipes) {
    return res.status(404).json({ message: "No Recipes Found" });
  }
  return res.status(200).json({ recipes });
};

const deleteRecipe = async (req, res, next) => {
  const id = req.params.id;
  let recipe;
  try {
    recipe = await Recipe.findByIdAndDelete(id).populate("user");
    await recipe.user.recipes.pull(recipe);
    await recipe.user.save();
  } catch (err) {
    return res.status(500).json({ message: "Unable To Delete" });
  }
  return res.status(200).json({ message: "Deleted Successfully" });
};

const getById = async (req, res, next) => {
  const id = req.params.id;
  let recipe;
  try {
    recipe = await Recipe.findById(id);
  } catch (err) {
    return res.status(400).json({ message: "Unable To Retrive Recipe" });
  }
  if (!recipe) {
    return res.status(404).json({ message: "No recipe found" });
  }
  return res.status(200).json({ recipe });
};

const getMyRecipes = async (req, res, next) => {
  const id = req.id;
  let recipes;
  try {
    recipes = await Recipe.find({ user: id });
  } catch (err) {
    return res.status(400).json({ message: "Unable to find user" });
  }
  if (!recipes) {
    return res.status(404).json({ message: "No blogs found" });
  }
  return res.status(200).json({ recipes });
};

const updateRecipe = async (req, res, next) => {
  const recipeId = req.params.id;
  const { title, description, images, mealType, timeToCook, ingredients } =
    req.body;
  let recipe;
  try {
    recipe = await Recipe.findByIdAndUpdate(recipeId, {
      title,
      description,
      images,
      mealType,
      timeToCook,
      ingredients,
    });
  } catch (err) {
    return res.status(400).json({ message: "Error Updating" });
  }
  if (!recipe) {
    return res.status(404).json({ message: "No recipe found" });
  }
  return res.status(200).json({ message: "Recipe Succesffully Updated" });
};

const topFourRecipes = async (req, res, next) => {
  let topRecipes;
  try {
    topRecipes = await Recipe.find().sort({ likes: 1 }).limit(4);
  } catch (err) {
    return res.status(400).json({ message: "Error Parsing Recipes" });
  }
  if (!topRecipes) {
    return res.status(404).json({ message: "No recipes" });
  }

  return res.status(200).json({ topRecipes });
};

module.exports = {
  addRecipe,
  getAllRecipes,
  deleteRecipe,
  getById,
  getMyRecipes,
  updateRecipe,
  topFourRecipes,
};
