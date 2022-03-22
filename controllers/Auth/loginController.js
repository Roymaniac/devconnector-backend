const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
// Load User model
const User = require("../../models/User");
const { secretOrKey } = require("../../config/keys");

/**
 * @param { email, password } req
 * @param { payload } res
 * @param {*} next
 * @returns a logged in user dashboard
 */

const login = (req, res, next) => {
    //obj destruction
    const { errors, isValid } = validateLoginInput(req.body);

    //check validation
    if (!isValid) {
        return res.status(400).json(errors);
    }

    const email = req.body.email;
    const password = req.body.password;

    //log user by email
    User.findOne({ email }).then((user) => {
        if (!user) {
            errors.email = "User not found";
            return res.status(404).json(errors);
        }

        // validate password
        bcrypt.compare(password, user.password).then((isMatch) => {
            if (isMatch) {
                //User Matched
                const payload = {
                    id: user.id,
                    name: user.name,
                    avatar: user.avatar,
                }; //create jwt payload || Transformer

                // Sign User Token
                jwt.sign(payload, secretOrKey, (err, token) => {
                    res.json({ success: true, token: token });
                });
            } else {
                errors.password = "Password incorrect";
                return res.status(400).json(errors);
            }
        });
        next();
    });
};

module.exports = {
    login,
};
