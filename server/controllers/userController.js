const bcrypt = require('bcrypt');
const prisma = require('../config/prisma');

// Get all users
exports.getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get single user
exports.getUserById = async (req, res) => {
  const { uid } = req.params;

  try {
    const user = await prisma.user.findUnique({
      where: { id: Number(uid) }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Signup
exports.createUser = async (req, res) => {
  const { firstName, lastName, email, mobile, username, password, birthdate, city, province, address } = req.body;

  try {

    const existing = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { username }
        ]
      }
    });

    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        mobile,
        username,
        password: hashedPassword,
        birthdate: new Date(birthdate),
        city,
        province,
        address
      }
    });

    const { password: _, ...userWithoutPassword } = user;

    res.status(201).json(userWithoutPassword);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Login
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const { password: _, ...userWithoutPassword } = user;

    res.status(200).json(userWithoutPassword);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Update user
exports.updateUser = async (req, res) => {
  const { uid } = req.params;

  try {

    const updatedUser = await prisma.user.update({
      where: { id: Number(uid) },
      data: req.body
    });

    res.status(200).json(updatedUser);

  } catch (err) {

    if (err.code === 'P2025') {
      return res.status(404).json({ message: 'User not found' });
    }

    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  const { uid } = req.params;

  try {

    await prisma.user.delete({
      where: { id: Number(uid) }
    });

    res.status(200).json({ message: 'User deleted successfully' });

  } catch (err) {

    if (err.code === 'P2025') {
      return res.status(404).json({ message: 'User not found' });
    }

    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};