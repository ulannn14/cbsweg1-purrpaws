// Import mongoose
const mongoose = require('mongoose');

/**
 * Cat Schema
 * Defines the structure of a Cat document in MongoDB
 */
const catSchema = new mongoose.Schema({

/**
 * Optional reference to an organization that the cat belongs to
 * Will be null if the cat is not yet associated with any user
 */
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false,
    default: null
  },

/**
 * Required reference to an organization that the cat belongs to
 */
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true
  },

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
   * Description of the cat's behavior and personality
   */
  temperament: {
    type: String,
    enum: ['Energetic', 'Calm', 'Shy', 'Friendly', 'Independent', 'Affectionate'],
  },

  /**
   * Cat's vaccination records
   * Array of vaccines the cat has received 
   */
  vaccinationStatus: [{
    type: String,
    enum: ['Spayed/Neutered', 'ARV(Anti-Rabies)', '4-in-1 Vaccine', 'Deworm'],
  }],


  /**
   * Image URL of the cat
   * This will store the link to uploaded image
   */
  image: {
    type: String,
    default: ''
  },

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
