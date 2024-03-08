// user router
const express = require('express');
const bcrypt = require('bcrypt');
const userModel = require('../src/userModel'); 
const { userDB } = require('../src/ultraDB'); 
const router = express.Router();
const { checkAuthenticated, checkNotAuthenticated } = require('../src/checkAuthentication'); 

// Configure Passport for authentication
const Passport = require('passport');
require('../src/passport-config')(Passport);
router.use(Passport.initialize());
router.use(Passport.session());

// Route to render the login page
router.get('/', checkNotAuthenticated, (req, res) => {
    res.render("login");
});

// Route to handle user login
router.post('/', checkNotAuthenticated, Passport.authenticate('local', {
    successRedirect: '/user', // Redirect to user dashboard on successful login
    failureRedirect: '/', // Redirect back to login page on failed login
    failureFlash: true
}));

// Route to render the add user page
router.get('/addUser', checkNotAuthenticated, (req, res) => {
    res.render("addUser", { message: ' Register your details below!', buttonMessage: 'Sign Up', isAdmin: false });
});

// Route to handle user registration
router.post('/addUser', checkNotAuthenticated, async (req, res) => {
    try {
        // Check if the user already exists
        const user = await userModel.findOne({ email: req.body.email });
        if (user) {
            return res.status(404).json({ message: 'Account Already exist' });
        }

        // Hash the password before storing it in the database
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        // Create a new user document
        await userModel.create({
            firstname: req.body.firstName,
            lastname: req.body.lastName,
            email: req.body.email,
            password: hashedPassword,
            role: 'user'
        });
        res.redirect('/'); // Redirect to home page after successful registration
    } catch (error) {
        console.error(error);
        res.redirect('/addUser', { message: ' Register your details below!', buttonMessage: 'Sign Up', isAdmin: false });
    }
});

// Route to render the user dashboard
router.get('/user', checkAuthenticated, (req, res) => {
    // Render the user dashboard and pass user information
    res.render("user", { id: req.user.id, firstname: req.user.firstname, lastname: req.user.lastname, email: req.user.email });
});

// Route to render the edit user page
router.get('/editUser/:id', checkAuthenticated, async (req, res) => {
    const id = req.params.id;
    try {
        // Find the user by ID
        const user = await userModel.findOne({ _id: id });
        // Render the edit user page and pass user information
        return res.render('editUser', { id: id, firstname: user.firstname, lastname: user.lastname, email: user.email, role: user.role, isAdmin: false });
    } catch (error) {
        console.error(error);
    }
});

// Route to handle editing user information
router.post('/editUser/:id', checkAuthenticated, async (req, res) => {
    const id = req.params.id;
    try {
        // Find the user by ID
        const user = await userModel.findOne({ _id: id });
        if (!user) {
            return res.status(404).send('User not found');
        }
        // Update user information
        user.firstname = req.body.firstName;
        user.lastname = req.body.lastName;
        await user.save(); // Save the updated user document
        return res.redirect('/user'); // Redirect to user dashboard after successful update
    } catch (error) {
        console.error(error);
        // Handle the error accordingly
        return res.status(500).send('Internal Server Error');
    }
});

// Route to handle user deletion
router.get('/deleteUser/:id', checkAuthenticated, async (req, res) => {
    const userId = req.params.id;
    try {
        // Find and delete the user by ID
        const deletedUser = await userModel.findByIdAndDelete(userId);
        if (!deletedUser) {
            // If user with the given ID doesn't exist, send a 404 status
            return res.status(404).json({ message: 'User not found' });
        }
        // Logout the user and redirect to home page
        req.logout(() => {
            console.log('Account deleted');
            res.redirect('/');
        });
    } catch (error) {
        // If an error occurs, send a 500 status and error message
        console.error('Error deleting user:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Route to handle user logout
router.get('/logout', (req, res) => {
    req.logout(() => {
        console.log('You are logged out');
        res.redirect('/');
    });
});

module.exports = router;
