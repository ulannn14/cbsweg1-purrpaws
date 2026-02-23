// Import Cat model
const Cat = require('../models/Cat');

/**
 * @desc    Get all cats
 * @route   GET /api/cats
 * @access  Public
 */
exports.getCats = async (req, res) => {
  try {
    // Fetch all cats from database
    const cats = await Cat.find();

    res.status(200).json(cats);
  } catch (error) {
    // Server error handling
    res.status(500).json({ error: error.message });
  }
};

/**
 * @desc    Get single cat by ID
 * @route   GET /api/cats/:id
 * @access  Public
 */
exports.getCatById = async (req, res) => {
  try {
    // Find cat by MongoDB ObjectId
    const cat = await Cat.findById(req.params.id);

    // If no cat found, return 404
    if (!cat) {
      return res.status(404).json({ message: "Cat not found" });
    }

    res.json(cat);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * @desc    Create a new cat
 * @route   POST /api/cats
 * @access  Public (should be Protected later)
 */
exports.createCat = async (req, res) => {
  try {
    // Create new cat document using request body
    const newCat = await Cat.create(req.body);

    res.status(201).json(newCat);
  } catch (error) {
    // Validation or bad request error
    res.status(400).json({ error: error.message });
  }
};

/**
 * @desc    Update existing cat
 * @route   PUT /api/cats/:id
 * @access  Public (should be Protected later)
 */
exports.updateCat = async (req, res) => {
  try {
    // Find and update cat, return updated version
    const updatedCat = await Cat.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedCat) {
      return res.status(404).json({ message: "Cat not found" });
    }

    res.json(updatedCat);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * @desc    Delete cat
 * @route   DELETE /api/cats/:id
 * @access  Public (should be Protected later)
 */
exports.deleteCat = async (req, res) => {
  try {
    // Find and delete cat
    const deletedCat = await Cat.findByIdAndDelete(req.params.id);

    if (!deletedCat) {
      return res.status(404).json({ message: "Cat not found" });
    }

    res.json({ message: "Cat deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
