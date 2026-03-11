const express = require("express");
const router = express.Router();
const organizationController = require("../controllers/organizationController");

// GET all organizations
router.get("/", organizationController.getOrganizations);

// GET single organization by ID
router.get("/:id", organizationController.getOrganizationById);

// LOGIN organization
router.post("/login", organizationController.loginOrganization);

module.exports = router;