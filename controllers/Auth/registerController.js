const gravatar = require("gravatar");
const bcrypt = require("bcrypt");
// Load User model
const User = require("../../models/User");

const saltRounds = Number(process.env.SALT);

/**
 *
 * @param {name, email, password} req
 * @param { success } res
 * @param {*} next
 * @returns a new user dashboard
 */

const register = (req, res, next) => {
    //obj destruction
    const { errors, isValid } = validateRegisterInput(req.body);

    //check validation
    if (!isValid) {
        return res.status(400).json(errors);
    }

    User.findOne({ email: req.body.email }).then((user) => {
        if (user) {
            errors.email = "Email already exists";
            return res.status(400).json(errors);
        } else {
            const avatar = gravatar.url(req.body.email, {
                s: "200", //size
                r: "pg", // rating
                d: "mm", // default
            });
            const newUser = new User({
                name: req.body.name,
                email: req.body.email,
                avatar,
                password: req.body.password,
            });

            bcrypt.genSalt(saltRounds, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) throw err;
                    newUser.password = hash;
                    newUser
                        .save()
                        .then((user) => res.json(user))
                        .catch((err) => console.log(err));
                });
            });
        }
    });
};

module.exports = {
    register,
};
