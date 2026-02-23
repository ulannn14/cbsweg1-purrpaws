const mongoose = require('mongoose');

const options = {};

const url = 'mongodb+srv://matthewfajardo_db_user:<db_password>@purrpaws.8qhjusz.mongodb.net/?appName=PurrPaws';

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(url, options);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;