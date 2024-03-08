const express = require('express');
const app = express();
const connectToDatabase = require('./connectDB');
const session = require('express-session');
const flash = require('express-flash');
require('dotenv').config();

// Connect to the MongoDB Atlas database
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@micron.mlrw0ua.mongodb.net/DB?retryWrites=true&w=majority&appName=Micron`;
connectToDatabase(uri);

// Set the view engine to EJS
app.set('view engine', 'ejs');

// Middleware for parsing JSON and URL-encoded request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Configure session middleware
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));

// Flash messages middleware
app.use(flash());

// Import authentication routes
const authRoutes = require('../routes/auth');

// Import password reset routes
const passwordResetRoutes = require('../routes/password');

// Import admin routes
const adminRoutes = require('../routes/admin');

// Use authentication routes
app.use('/', authRoutes);

// Use password reset routes
app.use('/', passwordResetRoutes);

// Use admin routes
app.use('/admin/', adminRoutes);

// Set the port to listen on
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
