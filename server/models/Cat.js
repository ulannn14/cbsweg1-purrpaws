// Import mongoose
const mongoose = require('mongoose');

/**
 * Cat Schema
 * Defines the structure of a Cat document in MongoDB
 */
const catSchema = new mongoose.Schema({

  /**
   * Name of the cat
   * Required field
   */
  name: {
    type: String,
    required: true,
    trim: true
  },

  /**
   * Age of the cat (in years)
   * Must be 0 or higher
   */
  age: {
    type: Number,
    required: true,
    min: 0
  },

  /**
   * Breed of the cat
   * Example: Persian, Siamese, Bengal
   */
  breed: {
    type: String,
    required: true,
    trim: true
  },

  /**
   * Gender of the cat
   * Restricted to only Male or Female
   */
  gender: {
    type: String,
    enum: ['Male', 'Female'],
    required: true
  },

  /**
   * Description of the cat
   * Can include personality, behavior, etc.
   */
  description: {
    type: String,
    default: ''
  },

  /**
   * Adoption status of the cat
   * - available → ready for adoption
   * - pending → application submitted
   * - adopted → successfully adopted
   */
  status: {
    type: String,
    enum: ['available', 'pending', 'adopted'],
    default: 'available'
  },

  /**
   * Image URL of the cat
   * This will store the link to uploaded image
   */
  image: {
    type: String,
    default: ''
  },

  /**
   * Reference to the organization or user who posted the cat
   * Uses MongoDB ObjectId to link to User model
   */
  organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }

}, {
  /**
   * Automatically adds:
   * - createdAt
   * - updatedAt
   */
  timestamps: true
});

/**
 * Export the Cat model
 * This allows us to use Cat in controllers
 */
module.exports = mongoose.model('Cat', catSchema);
