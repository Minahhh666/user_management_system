const mongoose = require('mongoose');

async function connectToDatabase(uri) {
    try {
        await mongoose.connect(uri);
        console.log('Connected to MongoDB Atlas');
    } catch (err) {
        console.error('Error connecting to MongoDB Atlas:', err);
        // You might want to throw the error here to handle it elsewhere
        throw err;
    }
}

module.exports = connectToDatabase;


