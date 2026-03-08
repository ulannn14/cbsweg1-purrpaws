const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// GET all users
router.get('/', userController.getUsers);

// GET single user by ID
router.get('/:uid', userController.getUserById);

// CREATE new user
router.post('/', userController.createUser);

// UPDATE user
router.put('/:uid', userController.updateUser);

// DELETE user
router.delete('/:uid', userController.deleteUser);

// SIGN UP
router.post('/signup', userController.createUser);

// LOGIN
router.post('/login', userController.loginUser);

module.exports = router;
