// Import mongoose
const mongoose = require('mongoose');

const organizationSchema = new mongoose.Schema({

/**
* Name of the organization
* Required field
*/
  name: {
    type: String,
    required: true,
    trim: true
  },

/**
* Address of the organization
* This can be a physical address or a general location description
*/
  address: {
    type: String,
    trim: true,
    required: true
  },

/**
* Organization's contact information
* Multiple contact methods can be stored (e.g., Facebook, email, Instagram)
*/
contactInfo: {
    facebook: String,
    email: String,
    instagram: String
    }

});

module.exports = mongoose.model('Organization', organizationSchema);