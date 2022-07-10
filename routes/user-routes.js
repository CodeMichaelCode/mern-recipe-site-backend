const express = require("express");
const router = express.Router();
const {
  signup,
  login,
  getAllUsers,
  refreshToken,
  verifyToken,
  logout,
  getUser,
} = require("../controllers/user-controllers");

router.post("/signup", signup);
router.post("/login", login);
router.get("/allusers", getAllUsers);
router.get("/refresh", refreshToken, verifyToken, getUser);
router.post("/logout", verifyToken, logout);

module.exports = router;
