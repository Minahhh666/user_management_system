//admin router
const express = require('express');
const bcrypt = require('bcrypt');
const userModel = require('../src/userModel'); 
const router = express.Router();
const Passport = require('passport'); 
const {checkAuthenticatedAdmin, checkNotAuthenticatedAdmin} = require('../src/checkAuthentication');

require('../src/passport-config')(Passport); // Configure Passport
router.use(Passport.initialize());
router.use(Passport.session());

// Route to render the admin login page
router.get('/', checkNotAuthenticatedAdmin, (req, res) => {
    res.render("loginAdmin");
});

// Route to handle admin login
router.post('/', checkNotAuthenticatedAdmin, Passport.authenticate('local', {
    successRedirect: '/admin/dashboard', // Redirect to admin dashboard on successful login
    failureRedirect: '/admin', // Redirect back to login page on failed login
    failureFlash: true
}));

// Route to render the add user page for admins
router.get('/addUser', checkAuthenticatedAdmin, (req, res) => {
    res.render("addUser", { message: ' Register new user', buttonMessage: 'Add User', isAdmin: true });
});

// Route to handle adding a new user by an admin
router.post('/addUser', checkAuthenticatedAdmin, async (req, res) => {
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
        // Redirect to admin dashboard after successful user creation
        return res.redirect('/admin/dashboard');
    } catch (error) {
        console.error(error);
        return res.redirect('/addUser'); // Redirect back to the add user page on error
    }
});

// Route to render the admin dashboard
router.get('/dashboard', checkAuthenticatedAdmin, async (req, res) => {
    try {
        // Fetch all users from the user collection
        const users = await userModel.find();
        console.log(users); // Log the users to the console

        // Render the dashboard page and pass the users data
        res.render("dashboard", { users, name: req.user.firstname });
    } catch (error) {
        console.error('Error fetching users:', error);
        return res.status(500).send('Internal Server Error'); // Return a server error if fetching users fails
    }
});

// Route to render the edit user page
router.get('/editUser/:id', checkAuthenticatedAdmin, async (req, res) => {
    const id = req.params.id;
    try {
        // Find the user by ID
        const user = await userModel.findOne({ _id: id });
        return res.render('editUser', { id: id, firstname: user.firstname, lastname: user.lastname, email: user.email, role: user.role, isAdmin: true });
    } catch (error) {
        console.error(error);
    }
});

// Route to handle editing user information
router.post('/editUser/:id', checkAuthenticatedAdmin, async (req, res) => {
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
        return res.redirect('/admin/dashboard'); // Redirect to admin dashboard after successful update
    } catch (error) {
        console.error(error);
        return res.status(500).send('Internal Server Error'); // Return a server error on failure
    }
});

// Route to handle user deletion by admin
router.get('/deleteUser/:id', checkAuthenticatedAdmin, async (req, res) => {
    const userId = req.params.id;
    try {
        // Find and delete the user by ID
        const deletedUser = await userModel.findByIdAndDelete(userId);
        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Redirect to admin dashboard after successful deletion
        res.redirect('/admin/dashboard');
    } catch (error) {
        console.error('Error deleting user:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Route to handle admin logout
router.get('/logout', (req, res) => {
    req.logout(() => {
        res.redirect('/admin');
    });
});

module.exports = router;
