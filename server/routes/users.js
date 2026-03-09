// routes/users.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Admin / REST routes
router.get('/', userController.getUsers);
router.get('/:uid', userController.getUserById);
router.put('/:uid', userController.updateUser);
router.delete('/:uid', userController.deleteUser);

// Public auth routes
router.post('/signup', userController.createUser);
router.post('/login', userController.loginUser);

module.exports = router;
