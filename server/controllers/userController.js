const bcrypt = require('bcrypt');
const prisma = require('../config/prisma');


// GET ALL USERS
exports.getUsers = async (req, res) => {
  try {

    const users = await prisma.user.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        userName: true,
        birthdate: true,
        city: true,
        address: true,
        provinceId: true,
        phoneNumber: true
      }
    });

    res.status(200).json(users);

  } catch (err) {

    console.error(err);
    res.status(500).json({ message: 'Server error' });

  }
};



// GET SINGLE USER
exports.getUserById = async (req, res) => {

  const { id } = req.params;

  try {

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        userName: true,
        birthdate: true,
        city: true,
        address: true,
        provinceId: true,
        phoneNumber: true
      }
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



// SIGNUP
exports.createUser = async (req, res) => {

  const {
    firstName,
    lastName,
    email,
    userName,
    password,
    birthdate,
    city,
    provinceId,
    address,
    phoneNumber
  } = req.body;

  try {

    const existing = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { userName }
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
        userName,
        password: hashedPassword,
        birthdate: new Date(birthdate),
        city,
        provinceId: Number(provinceId),
        address,
        phoneNumber
      }
    });

    const { password: _, ...userWithoutPassword } = user;

    res.status(201).json(userWithoutPassword);

  } catch (err) {

    console.error(err);
    res.status(500).json({ message: "Server error" });

  }
};



// LOGIN
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



// UPDATE USER
exports.updateUser = async (req, res) => {

  const { id } = req.params;

  try {

    // Remove id from body so it can't overwrite the primary key
    const { id: _, birthdate, ...rest } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        ...rest,

        ...(birthdate && {
          birthdate: new Date(birthdate)
        })
      }
    });

    const { password, ...userWithoutPassword } = updatedUser;

    res.status(200).json(userWithoutPassword);

  } catch (err) {

    if (err.code === "P2025") {
      return res.status(404).json({ message: "User not found" });
    }

    console.error(err);
    res.status(500).json({ message: "Server error" });

  }
};


// DELETE USER
exports.deleteUser = async (req, res) => {

  const { id } = req.params;

  try {

    await prisma.user.delete({
      where: { id }
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