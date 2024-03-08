// function to connect to MongoDB Atlas

const mongoose = require('mongoose');

async function connectToDatabase(uri) {
    try {
        await mongoose.connect(uri);
        console.log('Connected to MongoDB Atlas');
    } catch (err) {
        console.error('Error connecting to MongoDB Atlas:', err);
    }
}

module.exports = connectToDatabase;


