const express = require('express');
const router = express.Router();
const catController = require('../controllers/catController');

// GET all cats
router.get('/', catController.getCats);

// GET single cat by ID
router.get('/:id', catController.getCatById);

// CREATE new cat
router.post('/', catController.createCat);

// UPDATE cat
router.put('/:id', catController.updateCat);

// DELETE cat
router.delete('/:id', catController.deleteCat);

module.exports = router;
