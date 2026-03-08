const express = require('express');
const router = express.Router();
const orgController = require('../controllers/orgController');

// GET all organizations
router.get('/', orgController.getOrganizations);

// GET single organization by ID
router.get('/:id', orgController.getOrganizationById);

// CREATE new organization
router.post('/', orgController.createOrganization);

// UPDATE organization
router.put('/:id', orgController.updateOrganization);

// DELETE organization
router.delete('/:id', orgController.deleteOrganization);

module.exports = router;
