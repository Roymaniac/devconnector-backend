const express = require("express");
const router = express.Router();

//Login controller
const loginController = require("../../controllers/Auth/loginController");

//Register controller
const registerController = require("../../controllers/Auth/registerController");

//Get Current User
const userController = require("../../controllers/userController");

// @route   GET api/users/test
// @desc    Tests users route
// @access  Public

router.get("/test", (req, res) => res.json({ msg: "Users Retrieved" }));

// @route   POST api/users/register
// @desc    Register users route
// @access  Public

router.post("/register", registerController.register);

// @route   GET api/users/login
// @desc   Login User / JWT Token route
// @access  Public

router.post("/login", loginController.login);

// @route   GET api/users/current
// @desc    Return current users route
// @access  Private

router.get("/current", userController.getCurrentUser);

module.exports = router;
