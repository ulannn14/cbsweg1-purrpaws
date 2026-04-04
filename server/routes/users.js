const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { userUpload } = require("../middleware/upload");

// auth
router.post('/signup', userUpload, userController.createUser);
router.post('/login', userController.loginUser);

// users
router.get('/', userController.getUsers);
router.get('/:id', userController.getUserById);
router.put('/:id', userUpload, userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;