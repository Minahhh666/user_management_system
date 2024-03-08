// function to create a user model
const connectToDatabase = require('./connectDB');
const mongoose = require('mongoose');
require('dotenv').config();

const userSchema = new mongoose.Schema({
    firstname: String,
    lastname: String,
    email: String,
    password: String,
    role: String
});
const userModel = mongoose.model('instances', userSchema);
module.exports = userModel;

// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@micron.mlrw0ua.mongodb.net/?retryWrites=true&w=majority&appName=Micron`;
// connectToDatabase(uri);
// const user = new userModel({firstname: 'JK', lastname: 'Moo', email: 'a@a', password: '1234',role: 'user'});
// user.save().then(() => console.log('new user saved'));
// const admin = new userModel({firstname: 'JK', lastname: 'Moo', email: 'b@b', password: '1234',role: 'admin'});
// admin.save().then(() => console.log('new admin saved'));

