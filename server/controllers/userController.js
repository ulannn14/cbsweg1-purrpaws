// controllers/userController.js
const bcrypt = require('bcrypt');
const prisma = require('../config/prisma');

// Get all users
exports.getUsers = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users');
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get single user by ID
exports.getUserById = async (req, res) => {
  const { uid } = req.params;
  try {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [uid]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Signup / create user
exports.createUser = async (req, res) => {
  const { firstName, lastName, email, mobile, username, password, birthdate, city, province, address } = req.body;

  try {
    // Check if user exists
    const existing = await pool.query('SELECT * FROM users WHERE email = $1 OR username = $2', [email, username]);
    if (existing.rows.length > 0) return res.status(400).json({ message: 'User already exists' });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users (first_name,last_name,email,mobile,username,password,birthdate,city,province,address)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
      [firstName,lastName,email,mobile,username,hashedPassword,birthdate,city,province,address]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Login user
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) return res.status(400).json({ message: 'Invalid email or password' });

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });

    // Optional: remove password from response
    delete user.password;
    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update user
exports.updateUser = async (req, res) => {
  const { uid } = req.params;
  const fields = req.body;
  try {
    const setString = Object.keys(fields)
      .map((key, idx) => `${key}=$${idx + 1}`)
      .join(', ');
    const values = Object.values(fields);

    const result = await pool.query(`UPDATE users SET ${setString} WHERE id=$${values.length + 1} RETURNING *`, [...values, uid]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  const { uid } = req.params;
  try {
    const result = await pool.query('DELETE FROM users WHERE id=$1 RETURNING *', [uid]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'User not found' });
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
