// server/routes/organizations.js
const express = require("express");
const router = express.Router();
const organizationController = require("../controllers/organizationController");

router.get("/", organizationController.getOrganizations);

router.post("/login", organizationController.loginOrganization);

module.exports = router;