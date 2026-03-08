const bcrypt = require('bcrypt');
const pool = require('../config/db'); // your PostgreSQL pool connection

// Get all users
exports.getUsers = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users');
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get single user by ID
exports.getUserById = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [req.params.uid]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create new user
exports.createUser = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      mobile,
      username,
      password,
      birthdate,
      city,
      province,
      address
    } = req.body;

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const result = await pool.query(
      `INSERT INTO users 
      (firstName, lastName, email, mobile, username, password, birthdate, city, province, address)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
      [firstName, lastName, email, mobile, username, hashedPassword, birthdate, city, province, address]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update user
exports.updateUser = async (req, res) => {
  try {
    const { uid } = req.params;
    const {
      firstName,
      lastName,
      email,
      mobile,
      username,
      password,
      birthdate,
      city,
      province,
      address
    } = req.body;

    // Hash password if provided
    let hashedPassword = password;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(password, salt);
    }

    const result = await pool.query(
      `UPDATE users SET
        firstName=$1,
        lastName=$2,
        email=$3,
        mobile=$4,
        username=$5,
        password=$6,
        birthdate=$7,
        city=$8,
        province=$9,
        address=$10
      WHERE id=$11 RETURNING *`,
      [firstName, lastName, email, mobile, username, hashedPassword, birthdate, city, province, address, uid]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM users WHERE id=$1 RETURNING *', [req.params.uid]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
