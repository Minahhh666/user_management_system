const express = require('express');
const bcrypt = require('bcrypt');
const userModel = require('../src/userModel');
const router = express.Router();
const {checkAuthenticated,checkNotAuthenticated} = require('../src/checkAuthentication');
const userRole = require('../src/userRole');


require('dotenv').config();

const Passport = require('passport');
require('../passport-config')(Passport);


router.get('/', checkNotAuthenticated,(req, res) => {
    res.render("login");
})


router.post('/', checkNotAuthenticated,Passport.authenticate('local', {
    successRedirect: '/user',
    failureRedirect: '/',
    failureFlash: true
}))



router.get('/addUser', checkNotAuthenticated,(req, res) => {
    res.render("addUser", { message: ' Register your details below!',buttonMessage: 'Sign Up' });
})

// when the user sign up, encrypt the password and store the user info into database
router.post('/addUser', checkNotAuthenticated,async (req, res) => {
    try {
        // check if the user already exists
        const user = await userModel.findOne({ email:req.body.email });
        if (user) {
            return res.status(404).json({ message: 'Account Already exist' });
        }

        // add salt to prevent same password having same hash
        const hashedPassword = await bcrypt.hash(req.body.password,10)
        userModel.create({firstname: req.body.firstName, lastname: req.body.lastName, email: req.body.email, password: hashedPassword, role: 'user'})
        res.redirect('/')    
        }catch(error){
            console.error(error);
            res.redirect('/addUser', { message: ' Register your details below!',buttonMessage: 'Sign Up' });
    }
})



router.get('/user', checkAuthenticated,(req, res) => {
    res.render("user",{name: req.user.firstname});
})


// Logout
router.get('/logout', (req, res) => {
    req.logout(() => {
        req.flash('success_msg', 'You are logged out');
        res.redirect('/');
    });
});

module.exports = router;
