const Cat = require('../models/Pet');

// Get all cats
exports.getCats = async (req, res) => {
  try {
    const cats = await Cat.find();
    res.status(200).json(cats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get single cat by ID
exports.getCatById = async (req, res) => {
  try {
    const cat = await Cat.findById(req.params.id);

    if (!cat) {
      return res.status(404).json({ message: "Cat not found" });
    }

    res.status(200).json(cat);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create new cat
exports.createCat = async (req, res) => {
  try {
    const newCat = await Cat.create(req.body);
    res.status(201).json(newCat);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update cat
exports.updateCat = async (req, res) => {
  try {
    const updatedCat = await Cat.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedCat) {
      return res.status(404).json({ message: "Cat not found" });
    }

    res.status(200).json(updatedCat);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete cat
exports.deleteCat = async (req, res) => {
  try {
    const deletedCat = await Cat.findByIdAndDelete(req.params.id);

    if (!deletedCat) {
      return res.status(404).json({ message: "Cat not found" });
    }

    res.status(200).json({ message: "Cat deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
