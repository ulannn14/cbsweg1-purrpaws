const express = require('express');
const router = express.Router();

const {
  getPets,
  getPetById,
  createPet,
  updatePet,
  deletePet,
  getOrgPets
} = require('../controllers/petController');
const { getOrganizations } = require('../controllers/organizationController');

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

//router.get('/org/:orgId', getOrgPets);

module.exports = router;