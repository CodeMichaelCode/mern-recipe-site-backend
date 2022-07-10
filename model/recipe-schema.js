const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const recipeSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  images: {
    type: String,
    required: true,
  },

  ingredients: {
    type: [String],
    require: true,
    default: undefined,
  },
  likes: {
    type: Number,
    default: 1,
  },
  mealType: {
    type: String,
    require: true,
  },
  timeToCook: {
    type: Number,
    required: true,
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = mongoose.model("Recipe", recipeSchema);
