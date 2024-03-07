const express = require('express');
const bcrypt = require('bcrypt');
const userModel = require('../src/userModel');
const router = express.Router();
const {checkAuthenticated,checkNotAuthenticated} = require('../src/checkAuthentication');
require('dotenv').config();

const Passport = require('passport');
require('../passport-config')(Passport);


router.get('/', checkNotAuthenticated,(req, res) => {
    res.render("loginAdmin");
})


router.post('/', checkNotAuthenticated,Passport.authenticate('local', {
    successRedirect: '/admin/dashboard',
    failureRedirect: '/',
    failureFlash: true
}))

async function getAllUsers() {
    try {
        const users = await userModel.find(); // Fetch all documents from the user collection
        console.log(users);
        return users; // Return the array of users
    } catch (error) {
        console.error('Error fetching users:', error);
        return []; // Return an empty array if there's an error
    }
}

router.get('/addUser', checkAuthenticated,(req, res) => {
    res.render("addUser", { message: ' Register new user',buttonMessage: 'Add User' });
})


// Route handler for the '/admin' route
router.get('/dashboard', checkAuthenticated, async (req, res) => {
    try {
        // Fetch all users from the user collection
        const users = await getAllUsers();

        // Render the 'admin' template and pass the users data
        res.render("admin", { users ,name:req.user.firstname});
    } catch (error) {
        console.error('Error rendering admin page:', error);
        // Handle the error accordingly
        res.status(500).send('Internal Server Error');
    }
});


// Logout
router.get('/logout', (req, res) => {
    req.logout(() => {
        req.flash('success_msg', 'You are logged out');
        res.redirect('/');
    });
});

module.exports = router;