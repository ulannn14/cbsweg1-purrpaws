const multer = require("multer");

const storage = multer.memoryStorage();

const upload = multer({ storage });

const applicationUpload = upload.fields([
  { name: "validId" },
  { name: "consentProof" },
  { name: "housePhotos" }
]);

module.exports = applicationUpload;