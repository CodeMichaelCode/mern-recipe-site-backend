const express = require("express");
const recipeRouter = express.Router();
const {
  addRecipe,
  getAllRecipes,
  deleteRecipe,
  getById,
  getMyRecipes,
  updateRecipe,
  topFourRecipes,
} = require("../controllers/recipe-controller");
const { verifyToken } = require("../controllers/user-controllers");

recipeRouter.post("/add", verifyToken, addRecipe);
recipeRouter.get("/all", getAllRecipes);
recipeRouter.delete("/:id", deleteRecipe);
recipeRouter.get("/:id", getById);
recipeRouter.get("/myrecipes/all", verifyToken, getMyRecipes);
recipeRouter.put("/update/:id", verifyToken, updateRecipe);
recipeRouter.get("/top/four", topFourRecipes);

module.exports = recipeRouter;
