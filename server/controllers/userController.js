const { pool } = require('../config/db');
const bcrypt = require('bcrypt');

// ===============================
// USER CONTROLLER
// Handles CRUD operations for users
// ===============================

// Get all users
exports.getUsers = async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM users ORDER BY uid');
    client.release();
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get single user by ID
exports.getUserById = async (req, res) => {
  try {
    const uid = req.params.uid;
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM users WHERE uid=$1', [uid]);
    client.release();

    if (!result.rows[0]) {
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
      username,
      password,
      email,
      mobile,
      birthdate,
      city,
      province,
      address,
      organization_id,
      role
    } = req.body;

    const full_name = `${firstName} ${lastName}`;

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    const client = await pool.connect();
    const result = await client.query(
      `INSERT INTO users
        (username, full_name, password, email, mobile, birthdate, city, province, address, organization_id, role)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
       RETURNING *`,
      [
        username,
        full_name,
        hashedPassword,
        email || null,
        mobile || null,
        birthdate || null,
        city || null,
        province || null,
        address || null,
        organization_id || null,
        role || 'adoptee'
      ]
    );
    client.release();

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update user
exports.updateUser = async (req, res) => {
  try {
    const uid = req.params.uid;
    const {
      firstName,
      lastName,
      username,
      password,
      email,
      mobile,
      birthdate,
      city,
      province,
      address,
      organization_id,
      role
    } = req.body;

    const full_name = `${firstName} ${lastName}`;

    // Hash password if it is being updated
    let hashedPassword = password;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    const client = await pool.connect();
    const result = await client.query(
      `UPDATE users SET
        username=$1,
        full_name=$2,
        password=$3,
        email=$4,
        mobile=$5,
        birthdate=$6,
        city=$7,
        province=$8,
        address=$9,
        organization_id=$10,
        role=$11
       WHERE uid=$12
       RETURNING *`,
      [
        username,
        full_name,
        hashedPassword,
        email || null,
        mobile || null,
        birthdate || null,
        city || null,
        province || null,
        address || null,
        organization_id || null,
        role || 'adoptee',
        uid
      ]
    );
    client.release();

    if (!result.rows[0]) {
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
    const uid = req.params.uid;
    const client = await pool.connect();
    const result = await client.query('DELETE FROM users WHERE uid=$1 RETURNING *', [uid]);
    client.release();

    if (!result.rows[0]) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
