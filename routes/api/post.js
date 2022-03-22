const express = require("express");
const router = express.Router();

//Post Controller
const postController = require("../../controllers/postController");

// @route   GET api/posts/test
// @desc    Tests post route
// @access  Public

router.get("/test", (req, res) => res.json({ msg: "Posts Retrieved" }));

// @route   GET api/posts
// @desc    Get posts route
// @access  Public

router.get("/", postController.getAllPosts);

// @route   GET api/posts/:id
// @desc    Get post by id route
// @access  Public

router.get("/post/:id", postController.getSinglePost);

// @route   POST api/posts
// @desc    Create post route
// @access  Private

router.post("/", postController.createPost);

// @route   DELETE api/posts/:id
// @desc    Delete post route
// @access  Private

router.delete("/:id", postController.destroyPost);

// @route   POST api/posts/like/:id
// @desc    Like post route
// @access  Private

router.post("/like/:id", postController.likePost);

// @route   POST api/posts/unlike/:id
// @desc    Unlike post route
// @access  Private

router.post("/unlike/:id", postController.unlikePost);

// @route   POST api/posts/comment/:id
// @desc    Add comment to post route
// @access  Private

router.post("/comment/:id", postController.commentPost);

// @route   DELETE api/posts/comment/:id/:comment_id
// @desc    Delete comment from post route
// @access  Private

router.delete("/comment/:id/:comment_id", postController.deleteComment);

module.exports = router;
