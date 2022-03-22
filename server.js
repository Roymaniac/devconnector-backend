const express = require("express");
const mongoose = require("mongoose");
const passpsort = require("passport");
require("dotenv").config();

//import route files
const users = require("./routes/api/user");
const profile = require("./routes/api/profile");
const posts = require("./routes/api/post");
const cors = require("cors");

const app = express();

// Cors middleware
app.use(cors());

// Express bodyParser middleware
app.use(express.urlencoded({ extended: false }));

//DB config
const db = require("./config/keys").mongoURI;

//connect to mongodb atlas
mongoose
    .connect(db)
    .then(() => console.log("Database Connected"))
    .catch((err) => console.log(err));

//Passport middleware
app.use(passpsort.initialize());

//Passport Config
require("./config/passport")(passpsort);

//Routes middleware
app.use("/api/users", users);
app.use("/api/profile", profile);
app.use("/api/posts", posts);

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
