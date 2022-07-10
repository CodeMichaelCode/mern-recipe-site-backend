const User = require("../model/users-schema");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const signup = async (req, res, next) => {
  const { name, email, password } = req.body;
  let existingUser;
  try {
    existingUser = await User.findOne({ email });
  } catch (err) {
    return res.status(400).json({ message: err });
  }
  if (existingUser) {
    return res
      .status(400)
      .json({ message: "User already exist. Please login." });
  }
  const hashedPassword = bcrypt.hashSync(password);
  const user = new User({
    name,
    email,
    password: hashedPassword,
  });
  try {
    await user.save();
  } catch (err) {
    return res.status(400).json({ message: err });
  }
  return res.status(201).json({ user });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  let user;
  try {
    user = await User.findOne({ email });
  } catch (error) {
    return res.status(400).json({ message: err });
  }
  if (!user) {
    return res.status(404).json({ message: "No User Found. Please Sign Up." });
  }
  let isPasswordCorrect = bcrypt.compareSync(password, user.password);
  if (!isPasswordCorrect) {
    return res.status(400).json({ message: "Incorrect Password" });
  }

  const token = jwt.sign({ id: user._id }, process.env.WEBTOKEN, {
    expiresIn: "35s",
  });

  console.log("Generated Token\n", token);

  if (req.cookies[`${user._id}`]) {
    req.cookies[`${user._id}`] = "";
  }

  res.cookie(String(user._id), token, {
    path: "/",
    expires: new Date(Date.now() + 1000 * 30),
    httpOnly: true,
    sameSite: "lax",
    secure: true,
  });

  return res.status(200).json({ message: "Succesfully Logged In" });
};

const verifyToken = (req, res, next) => {
  const cookies = req.headers.cookie;
  const token = cookies.split("=")[1];

  if (!token) {
    res.status(404).json({ message: "No Token Found", token });
  }

  jwt.verify(String(token), process.env.WEBTOKEN, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid Token" });
    }
    req.id = user.id;
  });
  next();
};

const getAllUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find();
  } catch (err) {
    return res.status(500).json({ message: "Unable to retrieve users" });
  }
  if (!users) {
    return res.status(404).json({ message: "No Users Found" });
  }
  return res.status(200).json({ message: "Successfully Found Users", users });
};

const logout = (req, res, next) => {
  const cookies = req.headers.cookie;
  const prevToken = cookies.split("=")[1];
  if (!prevToken) {
    return res.status(400).json({ message: "Couldn't find Token" });
  }
  jwt.verify(String(prevToken), process.env.WEBTOKEN, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Authentication Fail" });
    }
    res.clearCookie(`${user.id}`);
    req.cookies[`${user.id}`] = "";
    return res.status(200).json({ message: "Successfully Logged Out" });
  });
};

const refreshToken = (req, res, next) => {
  const cookies = req.headers.cookie;
  const prevCookie = cookies.split("=")[1];
  if (!prevCookie) {
    return res.status(400).json({ message: "Couldn't Find Cookie" });
  }
  jwt.verify(String(prevCookie), process.env.WEBTOKEN, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Authentication Fail" });
    }
    res.clearCookie(`${user.id}`);
    req.cookies[`${user.id}`] = "";

    const token = jwt.sign({ id: user.id }, process.env.WEBTOKEN, {
      expiresIn: "12h",
    });

    console.log("Generate Token\n", token);

    res.cookie(String(user.id), token, {
      path: "/",
      sameSite: "lax",
      httpOnly: true,
      secure: true,
      expires: new Date(Date.now() + 1000 * 43200),
    });

    req.id = user.id;
    next();
  });
};

const getUser = async (req, res, next) => {
  let id = req.id;
  let user;
  try {
    user = await User.findById(id, "-password");
  } catch (err) {
    return res.status(400).json({ message: "Error finding user" });
  }
  if (!user) {
    return res.status(404).json({ message: "No user found" });
  }
  return res.status(200).json({ user });
};

module.exports = {
  signup,
  login,
  getAllUsers,
  verifyToken,
  logout,
  refreshToken,
  getUser,
};
