const express = require("express");
const router = express.Router();
const organizationController = require("../controllers/organizationController");
const { organizationUpload } = require("../middleware/upload");

// GET all organizations
router.get("/", organizationController.getOrganizations);

// GET single organization by ID
router.get("/:id", organizationController.getOrganizationById);

// LOGIN organization
router.post("/login", organizationController.loginOrganization);

router.put("/:id", organizationUpload, organizationController.updateOrganization);

module.exports = router;