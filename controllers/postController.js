const passport = require("passport");

//Load Post Model
const Profile = require("../models/Profile");
const Post = require("../models/Post");

/**
 *
 * @param {*} req
 * @param {*} res
 * @returns Get All Posts
 */

const getAllPosts = (req, res) => {
    Post.find()
        .sort({ date: -1 })
        .then((posts) => {
            res.json(posts);
        })
        .catch((err) => res.status(404).json({ message: "No posts found" }));
};

/**
 *
 * @param { id } req
 * @param {*} res
 * @returns A Single Post
 */

const getSinglePost = (req, res) => {
    Post.findById(req.params.id)
        .then((posts) => {
            res.json(posts);
        })
        .catch((err) => res.status(404).json({ message: "No post found" }));
};

/**
 * @param {*} req
 * @param {*} res
 * @returns New Post From Authenticated User
 */

const createPost =
    (passport.authenticate("jwt", { session: false }),
    (req, res) => {
        const { errors, isValid } = validatePost(req.body);

        //Check validation
        if (!isValid) {
            return res.status(400).json(errors);
        }
        const newPost = new Post({
            text: req.body.text,
            name: req.body.name,
            avatar: req.body.avatar,
            user: req.user.id,
        });

        newPost.save().then((post) => {
            res.json(post);
        });
    });

/**
 * @param { id } req
 * @param {*} res
 * @returns success true
 */

const destroyPost =
    (passport.authenticate("jwt", { session: false }),
    (req, res) => {
        Profile.findOne({ user: req.user.id }).then((profile) => {
            Post.findById({ post: req.params.id }).then((post) => {
                //check if the user is the owner of post
                if (post.user.toString() !== req.user.id) {
                    return res
                        .status(401)
                        .json({ message: "User not authorized" });
                }

                //Delete Post
                post.remove()
                    .then(() => {
                        return res.json({ success: true });
                    })
                    .catch((err) =>
                        res.status.json({ message: "Post not found" })
                    );
            });
        });
    });

/**
 * @param { id } req
 * @param {*} res
 * @returns A liked post
 */

const likePost =
    (passport.authenticate("jwt", { session: false }),
    (req, res) => {
        Profile.findOne({ user: req.user.id }).then((profile) => {
            Post.findById({ post: req.params.id })
                .then((post) => {
                    if (
                        post.likes.filter(
                            (like) => like.user.toString() === req.user.id
                        ).length > 0
                    ) {
                        return res
                            .status(400)
                            .json({ message: "User already liked the post" });
                    }

                    //Add user id to likes arrray
                    post.likes.unshift({ user: req.user.id });
                    //save
                    post.save().then((post) => res.json(post));
                })
                .catch((err) => res.status.json({ message: "Post not found" }));
        });
    });

/**
 * @param { id } req
 * @param {*} res
 * @returns Unlike Post
 */

const unlikePost =
    (passport.authenticate("jwt", { session: false }),
    (req, res) => {
        Profile.findOne({ user: req.user.id }).then((profile) => {
            Post.findById({ post: req.params.id })
                .then((post) => {
                    if (
                        post.likes.filter(
                            (like) => like.user.toString() === req.user.id
                        ).length === 0
                    ) {
                        return res
                            .status(400)
                            .json({ message: "User have not liked the post" });
                    }

                    //Get index to be removed
                    const postIndex = post.likes
                        .map((item) => item.user.toString())
                        .indexOf(req.user.id);

                    //splice likes array
                    post.likes.splice(postIndex, 1);

                    //save
                    post.save().then((post) => res.json(post));
                })
                .catch((err) => res.status.json({ message: "Post not found" }));
        });
    });

/**
 * @param { id } req
 * @param {*} res
 * @returns A new comment
 */

const commentPost =
    (passport.authenticate("jwt", { session: false }),
    (req, res) => {
        const { errors, isValid } = validatePost(req.body);

        //Check validation
        if (!isValid) {
            return res.status(400).json(errors);
        }

        Profile.findById(rq.params.id)
            .then((post) => {
                const newComment = {
                    text: req.body.text,
                    name: req.body.name,
                    avatar: req.body.avatar,
                    user: req.user.id,
                };

                //Add comment
                post.comments.unshift(newComment);

                //Save comment
                post.save().then((post) => res.json(post));
            })
            .catch((err) => res.status(404).json({ message: "No post found" }));
    });

/**
 * @param { id } req
 * @param {*} res
 * @returns Delete a comment
 */

const deleteComment =
    (passport.authenticate("jwt", { session: false }),
    (req, res) => {
        Profile.findById(rq.params.id)
            .then((post) => {
                if (
                    post.comments.filter(
                        (comment) =>
                            comment._id.toString() === req.params.comment_id
                    ).length === 0
                ) {
                    return res
                        .status(404)
                        .json({ message: "Comment does not exist" });
                }

                //Get comment index
                const commentIndex = post.comments
                    .map((item) => item._id.toString())
                    .indexOf(req.params.comment_id);

                //Remove from the array
                post.comments.splice(commentIndex, 1);

                //Save
                post.save().then((post) => res.json(post));
            })
            .catch((err) => res.status(404).json({ message: "No post found" }));
    });

module.exports = {
    getAllPosts,
    getSinglePost,
    createPost,
    destroyPost,
    likePost,
    unlikePost,
    commentPost,
    deleteComment,
};
