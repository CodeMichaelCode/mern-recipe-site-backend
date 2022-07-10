const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const router = require("./routes/user-routes");
const recipeRouter = require("./routes/recipe-routes");
const corsMiddleware = require("./config/corsOptions");

require("dotenv").config();

app.use(corsMiddleware);
app.use(express.json());
app.use(cookieParser());

app.use("/", router);

app.use("/recipe", recipeRouter);

mongoose
  .connect(
    `mongodb+srv://admin:${process.env.PASSWORD}@cluster0.jsnbh.mongodb.net/recipe-site?retryWrites=true&w=majority`
  )
  .then(() => app.listen(process.env.PORT))
  .then(() => console.log("Server connected to DB"))
  .catch((err) => new Error(err));
