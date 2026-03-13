const express = require("express");
const router = express.Router();

const controller = require("../controllers/applicationController");

router.post("/", controller.createApplication);

// adopter
router.get("/user/:userId", controller.getMyApplications);

// organization
router.get("/org/:orgId", controller.getOrgApplications);

// specific application
router.get("/:id", controller.getApplicationById);

router.put("/:id/approve", controller.approveApplication);

router.put("/:id/status", controller.updateApplicationStatus);

module.exports = router;