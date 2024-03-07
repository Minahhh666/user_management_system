const express = require('express');
const bcrypt = require('bcrypt');
const userModel = require('../src/userModel');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const router = express.Router();
const {checkNotAuthenticated} = require('../src/checkAuthentication');

require('dotenv').config();

// const Passport = require('passport');
// require('../passport-config')(Passport);




router.get('/forgetPassword', checkNotAuthenticated,(req, res) => {
    res.render('forgetPassword', { verifyText:false});
});


router.post('/forgetpassword', checkNotAuthenticated,async (req, res) => {
    // Check if user with provided email exists
    const user = await userModel.findOne({ email:req.body.email });
    
    if (user) {
    
    // create a jwt token
    const token = jwt.sign({ email:user.email }, `${process.env.JWT_SECRET}`, { expiresIn: '1h' });
    console.log(token);
    const resetLink = `http://localhost:3000/resetPassword?token=${token}`;


    // Send email with password reset link
    try {
        // Create a nodemailer transporter
        let transporter = nodemailer.createTransport({
          service: 'outlook', 
          auth: {
            user: process.env.EMAIL, 
            pass: process.env.EMAIL_PASSWORD 
          }
        });
    
        // Email message options
        let mailOptions = {
          from: process.env.EMAIL, 
          to: user.email, 
          subject: 'Password Reset', 
          text: resetLink
        };
    
        // Send email
        let info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ', info);
    
      } catch (error) {
        console.error('Error sending email: ', error);
        res.status(500).send('Error sending email');
      }
    }   
    return res.render('forgetPassword', { verifyText:true});
});

router.get('/resetPassword', (req, res) => {
    const token = req.query.token;
    return res.render('resetPassword',{token:token, passwordNotMatch:false});
});

router.post('/resetPassword',(req, res) => {
    const token = req.query.token; 
    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
        if (err) {
            // Handle invalid or expired token
            return res.status(400).send('Invalid or expired token');
        } else {
            // Check if passwords match
            if (req.body.password1 !== req.body.password2) {
                console.log('Passwords do not match. Please try again.');
                return res.render('resetPassword',{token:token, passwordNotMatch:true});             
            }


            // Token is valid, allow user to reset password
            const userEmail = decoded.email;
            const user = await userModel.findOne({ email: userEmail });
            const hashedPassword = await bcrypt.hash(req.body.password1,10)
            user.password = hashedPassword;
            await user.save();
            console.log('Password updated successfully');
            res.redirect('/');
        }})
});

module.exports = router;