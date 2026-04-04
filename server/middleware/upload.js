const multer = require("multer");

const storage = multer.memoryStorage();

const upload = multer({ storage });

const applicationUpload = upload.fields([
  { name: "validId" },
  { name: "consentProof" },
  { name: "housePhotos" }
]);

<<<<<<< HEAD
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
=======
module.exports = applicationUpload;
>>>>>>> parent of d856625 (fixed uploads)
