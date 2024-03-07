const express = require('express');
const app = express();
const connectToDatabase = require('./connectDB');
const session = require('express-session');
const flash = require('express-flash');
require('dotenv').config();

const Passport = require('passport');
// require('../passport-config')(Passport);




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@micron.mlrw0ua.mongodb.net/DB?retryWrites=true&w=majority&appName=Micron`;
connectToDatabase(uri);

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false

}))
// app.use(Passport.initialize());
app.use(Passport.session());
app.use(flash());


// Set up JWT middleware
// app.use(eJwt({ secret: process.env.JWT_SECRET ,algorithms: ['HS256'], path: ['/resetPassword'] }));





const authRoutes = require('../routes/auth');
const passwordResetRoutes = require('../routes/password');
const adminRoutes = require('../routes/admin');

// Use authentication routes
app.use('/', authRoutes);

// Use password reset routes
app.use('/', passwordResetRoutes);

// Use admin routes
app.use('/admin/', adminRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log('Server is running on port 3000');
});