const express = require('express');
const router = express.Router();

const {
  getPets,
  getPetById,
  createPet,
  updatePet,
  deletePet
} = require('../controllers/petController');

// GET all pets
router.get('/', getPets);

// GET pet by ID
router.get('/:id', getPetById);

// CREATE pet
router.post('/', createPet);

// UPDATE pet
router.put('/:id', updatePet);

// DELETE pet
router.delete('/:id', deletePet);

module.exports = router;