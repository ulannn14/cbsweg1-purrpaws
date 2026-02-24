// Import mongoose
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({

/**
   * Name of the user
   * Required field
   */
  username: {
    type: String,
    required: true,
    trim: true
  }

  // No password yet since no login system is implemented

});

module.exports = mongoose.model('User', userSchema);