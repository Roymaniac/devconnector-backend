const express = require("express");
const mongoose = require('mongoose');


//import route files
const users = require('./routes/api/user');
const profile = require('./routes/api/profile');
const posts = require('./routes/api/post');

const app = express();


//DB config
const db = require('./config/keys').mongoURI;

//connect to mongodb atlas 
mongoose
    .connect(db)
    .then(() => console.log('Database Connected'))
    .catch(err => console.log(err));


//Routes middleware 
app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/posts', posts);


app.get("/", (req, res) => {
  res.send("Hello from dev");
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
