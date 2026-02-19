const express = require("express");
const router = express.Router();
const { getAllCats } = require("../controllers/catController");

router.get("/", getAllCats);

module.exports = router;
