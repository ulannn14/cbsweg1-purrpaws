const express = require('express');
const router = express.Router();
const { petUpload } = require("../middleware/upload");

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
router.post('/', petUpload, createPet);

// UPDATE pet
router.put('/:id', petUpload, updatePet);

// DELETE pet
router.delete('/:id', deletePet);

//router.get('/org/:orgId', getOrgPets);

module.exports = router;