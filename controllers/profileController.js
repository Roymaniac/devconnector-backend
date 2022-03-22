const passport = require("passport");
// Load Profile model
const Profile = require("../models/Profile");
//Load Validation Input
const validateProfileInput = require("../validation/profile");
//Load Validate Experience
const validateExperience = require("../validation/experience");
//load Validate Education
const validateEducation = require("../validation/education");

/**
 * @param { id } res
 * @param {*} res
 * @returns Get User Profile
 */

const getUserProfile =
    (passport.authenticate("jwt", { session: false }),
    (req, res) => {
        const errors = {};

        Profile.findOne({ user: req.user.id })
            .populate("user", ["name", "avatar"]) //populate the user info into the profile object
            .then((profile) => {
                if (!profile) {
                    errors.noprofile = "User profile does not exist";
                    return res.status(400).json(errors);
                }
                res.json(profile);
            })
            .catch((err) => res.status(404).json(err));
    });

/**
 * @param { handle } res
 * @param {*} res
 * @returns Get Profile By Handle
 */

const getProfileByHandle = (req, res) => {
    const errors = {};
    Profile.findOne({ handle: req.params.handle })
        .populate("user", ["name", "avatar"])
        .then((profile) => {
            if (!profile) {
                errors.noprofile = "There is no profile for this user";
                return res.status(404).json(errors);
            }
            res.json(profile);
        })
        .catch((err) => res.status(404).json(err));
};

/**
 * @param { handle } res
 * @param {*} res
 * @returns Get Single Profile
 */

const getSingleProfile = (req, res) => {
    const errors = {};
    Profile.findOne({ user: req.params.user_id })
        .populate("user", ["name", "avatar"])
        .then((profile) => {
            if (!profile) {
                errors.noprofile = "There is no profile for this user";
                return res.status(404).json(errors);
            }
            res.json(profile);
        })
        .catch(() =>
            res
                .status(404)
                .json({ profile: "There is no profile for this user" })
        );
};

/**
 * @param { handle } res
 * @param {*} res
 * @returns Get All Users Profile
 */

const getAllProfile = (req, res) => {
    const errors = {};
    Profile.find()
        .populate("user", ["name", "avatar"])
        .then((profile) => {
            if (!profile) {
                errors.noprofile = "There are no user profiles";
                res.status(404).json(errors);
            }
            res.json(profile);
        })
        .catch(() =>
            res.status(404).json({ profile: "There are no use profiles" })
        );
};

/**
 * @param { handle } res
 * @param {*} res
 * @returns Get Create Users Profile
 */

const createUserProfile =
    (passport.authenticate("jwt", { session: false }),
    (req, res) => {
        const { errors, isValid } = validateProfileInput(req.body);

        //Check Validation
        if (!isValid) {
            //return any errors with 400 status
            return res.status(400).json(errors);
        }
        //Get fields
        const profileFields = {};
        profileFields.user = req.user.id;
        if (req.body.handle) profileFields.handle = req.body.handle;
        if (req.body.company) profileFields.company = req.body.company;
        if (req.body.website) profileFields.website = req.body.website;
        if (req.body.location) profileFields.location = req.body.location;
        if (req.body.status) profileFields.status = req.body.status;

        //Skills (Array)
        if (typeof req.body.skills !== undefined) {
            profileFields.skills = req.body.skills.split(",");
        }
        if (req.body.bio) profileFields.bio = req.body.bio;
        if (req.body.githubusername)
            profileFields.githubusername = req.body.githubusername;

        //Socials Object Fields
        profileFields.social = {};
        if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
        if (req.body.twitter) profileFields.social.twitter = req.body.twitter;
        if (req.body.facebook)
            profileFields.social.facebook = req.body.facebook;
        if (req.body.linkedin)
            profileFields.social.linkedin = req.body.linkedin;
        if (req.body.instagram)
            profileFields.social.instagram = req.body.instagram;

        Profile.findOne({ user: req.user.id }).then((profile) => {
            if (profile) {
                //Update Users Profile
                Profile.findOneAndUpdate(
                    { user: req.user.id },
                    { $set: profileFields },
                    { new: true }
                ).then((profile) => res.json(profile));
            } else {
                //Create Users Profile

                Profile.findOne({ handle: profileFields.handle }).then(
                    (profile) => {
                        if (profile) {
                            errors.handle = "Profile Already Exists";
                            res.status(400).json(errors);
                        }
                        //Save Users Profile
                        new Profile(profileFields)
                            .save()
                            .then((profile) => res.json(profile));
                    }
                );
            }
        });
    });

/**
 * @param { user.id } res
 * @param {*} res
 * @returns Add Experience Profile
 */

const addExperience =
    (passport.authenticate("jwt", { session: false }),
    (req, res) => {
        const { errors, isValid } = validateExperience(req.body);

        //check validation
        if (!isValid) {
            return res.status(400).json(errors);
        }

        Profile.findOne({ user: req.user.id }).then((profile) => {
            const newExp = {
                title: req.body.title,
                company: req.body.company,
                location: req.body.location,
                from: req.body.from,
                to: req.body.to,
                current: req.body.current,
                description: req.body.description,
            };

            //Add to Experience Array with unshift
            profile.experience.unshift(newExp);

            //Save
            profile.save.then((profile) => {
                res.json(profile);
            });
        });
    });

/**
 * @param { user.id } res
 * @param {*} res
 * @returns Delete Experience Profile
 */

const deleteExperience =
    (passport.authenticate("jwt", { session: false }),
    (req, res) => {
        Profile.findOne({ user: req.user.id }).then((profile) => {
            //Get index to be removed
            const removeIndex = profile.experience
                .map((item) => item.id)
                .indexOf(req.params.exp_id);

            //Splice the array
            profile.experience.splice(removeIndex, 1);

            //save
            profile
                .save()
                .then((profile) => {
                    res.json(profile);
                })
                .catch((err) => res.status(404).json(err));
        });
    });

/**
 * @param { user.id } res
 * @param {*} res
 * @returns Add Education Profile
 */

const addEducation =
    (passport.authenticate("jwt", { session: false }),
    (req, res) => {
        const { errors, isValid } = validateEducation(req.body);

        //check validation
        if (!isValid) {
            return res.status(400).json(errors);
        }

        Profile.findOne({ user: req.user.id }).then((profile) => {
            const newEdu = {
                school: req.body.school,
                degree: req.body.degree,
                fieldofstudy: req.body.fieldofstudy,
                from: req.body.from,
                to: req.body.to,
                current: req.body.current,
                description: req.body.description,
            };

            //Add to Experience Array with unshift
            profile.experience.unshift(newEdu);

            //Save
            profile.save.then((profile) => {
                res.json(profile);
            });
        });
    });

/**
 * @param { user.id } res
 * @param {*} res
 * @returns Delete Education Profile
 */

const deleteEducation =
    (passport.authenticate("jwt", { session: false }),
    (req, res) => {
        Profile.findOne({ user: req.user.id }).then((profile) => {
            //Get index to be removed
            const removeIndex = profile.education
                .map((item) => item.id)
                .indexOf(req.params.edu_id);

            //Splice the array
            profile.education.splice(removeIndex, 1);

            //save
            profile
                .save()
                .then((profile) => {
                    res.json(profile);
                })
                .catch((err) => res.status(404).json(err));
        });
    });

/**
 * @param { user.id } res
 * @param {*} res
 * @returns Delete Profile
 */

const deleteProfile =
    (passport.authenticate("jwt", { session: false }),
    (req, res) => {
        Profile.findOneAndRemove({ user: req.user.id }).then(() => {
            User.findOneAndRemove({ _id: req.user.id }).then(() =>
                res.json({ success: true })
            );
        });
    });

module.exports = {
    getUserProfile,
    getProfileByHandle,
    getSingleProfile,
    getAllProfile,
    createUserProfile,
    addExperience,
    deleteExperience,
    addEducation,
    deleteEducation,
    deleteProfile,
};
