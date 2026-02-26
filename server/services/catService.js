const Cat = require('../models/Cat');

// Get all cats
const getAllCats = async () => {
  return await Cat.find();
};

// Get cat by ID
const getCatById = async (id) => {
  return await Cat.findById(id);
};

// Create cat
const createCat = async (data) => {
  return await Cat.create(data);
};

// Update cat
const updateCat = async (id, data) => {
  return await Cat.findByIdAndUpdate(id, data, { new: true });
};

// Delete cat
const deleteCat = async (id) => {
  return await Cat.findByIdAndDelete(id);
};

module.exports = {
  getAllCats,
  getCatById,
  createCat,
  updateCat,
  deleteCat
};
