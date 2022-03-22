const express = require("express");
const router = express.Router();
const passport = require("passport");

const profileController = require("../../controllers/profileController");

// @route   GET api/profile/test
// @desc    Tests profile route
// @access  Public

router.get("/test", (req, res) => res.json({ msg: "Profiles Retrieved" }));

// @route   GET api/profile
// @desc    Get current users profile route
// @access  Private

router.get("/", profileController.getUserProfile);

// @route   GET api/profile/handle/:handle
// @desc    Get profile by handle
// @access  Public

router.get("/handle/:handle", profileController.getProfileByHandle);

// @route   GET api/profile/user/:user_id
// @desc    Get profile by user ID
// @access  Public

router.get("/user/:user_id", profileController.getSingleProfile);

// @route   POST api/profile/all
// @desc    Create all user profiles
// @access  Public

router.get("/all", profileController.getAllProfile);

// @route   POST api/profile
// @desc    Create users profile route
// @access  Private

router.post("/", profileController.createUserProfile);

// @route   POST api/profile/experience
// @desc    Add experience to profile route
// @access  Public

router.post("/experience", profileController.addExperience);

// @route   POST api/profile/education
// @desc    Add education to profile route
// @access  Public

router.post("/education", profileController.addEducation);

// @route   DELETE api/profile/experience/:exp_id
// @desc    Remove experience from profile route
// @access  Public

router.delete("/experience/:exp_id", profileController.deleteExperience);

// @route   DELETE api/profile/education/:edu_id
// @desc    Remove education from profile route
// @access  Private

router.delete("/education/:edu_id", profileController.deleteEducation);

// @route   DElete api/profile/
// @desc    Remove user & profile route
// @access  Private

router.delete("/", profileController.deleteProfile);

module.exports = router;
