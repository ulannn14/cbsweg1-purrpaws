const multer = require("multer");

const storage = multer.memoryStorage();

const upload = multer({ storage });

const applicationUpload = upload.fields([
  { name: "validId" },
  { name: "consentProof" },
  { name: "housePhotos" }
]);

const petUpload = upload.fields([
  { name: "petImages" }
]);

const userUpload = upload.fields([
  { name: "userImage" }
]);

module.exports = {
  applicationUpload,
  petUpload,
  userUpload
};