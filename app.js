//jshint esversion:6
require('dotenv').config()
const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const encryption = require('mongoose-encryption')



// await User.findOne();

const app = express();

app.use(express.static('public'));
app.set("view engine", 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb://127.0.0.1:27017/userDB");
const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

userSchema.plugin(encryption, { secret: process.env.SECRET, encryptedFields: ['password'] });
const User = new mongoose.model("User", userSchema);

app.get("/", (req, res) => {
    res.render("home");
})
app.get("/login", (req, res) => {
    res.render("login");
})
app.get("/register", (req, res) => {
    res.render("register");
})

app.post('/register', async (req, res) => {
    const user = new User({
        "email": req.body.username,
        "password": req.body.password
    });
    try {
        await user.save()
        console.log("User Saved");
        res.render('secrets')
    } catch (error) {
        res.send(error.message);
    }
})

app.post('/login', async (req, res) => {
    const userMail = req.body.username;
    const userPassword = req.body.password;

    try {
        await User.findOne({ "email": userMail }).then((foundResult) => {
            if (foundResult) {
                if (foundResult.password === userPassword) {
                    console.log(`${userMail} logged in successfully`)
                    res.render('secrets')
                } else {
                    res.send('Password not match')
                }
            } else {
                res.send("Email not found")
            }
        })
    } catch (err) {
        res.send(err.message)
    }
})

app.listen(3000, () => {
    console.log(`Server is running on port 3000`);
})