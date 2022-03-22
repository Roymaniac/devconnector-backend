const passport = require("passport");

/**
 * @returns current user info
 */

const getCurrentUser =
    (passport.authenticate("jwt", { session: false }),
    (req, res) => {
        res.json({
            id: req.user.id,
            name: req.user.name,
            email: req.user.email,
        });
    });

module.exports = {
    getCurrentUser,
};
