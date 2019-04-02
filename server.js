require('dotenv').config();
const express = require('express');
const app =express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');

const users = require('./routes/api/users');
const profile = require('./routes/api/profile');

//body parsing
app.use(bodyParser.urlencoded({extended: false}));;
app.use(bodyParser.json());

// Connecting Database
const db = process.env.mongoURI;

mongoose
    .connect(db)
    .then(()=>{
        console.log("DB Connected");
    })
    .catch((err)=>{
        console.log("DB not connected!")
        console.log(err)
    })

app.get('/',(req,res)=>{
    res.send('Hello');
})

//Passport middleware
app.use(passport.initialize());

//Passport config
require('./config/passport')(passport);

//Routes 

app.use('/api/users', users);
app.use('/api/profile', profile);

// Server setup
const port = process.env.PORT || 5000;
app.listen(port, ()=>{
    console.log('Server is running at http://localhost:'+port)
});