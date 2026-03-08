const { pool } = require('../config/db');
const bcrypt = require('bcrypt');

// Get all users
exports.getUsers = async (req, res) => {
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT * FROM users ORDER BY uid');
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
};

// Get single user by ID
exports.getUserById = async (req, res) => {
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT * FROM users WHERE uid=$1', [req.params.uid]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
};

// Create new user
exports.createUser = async (req, res) => {
  const client = await pool.connect();
  try {
    const { username, full_name, password, organization_id, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await client.query(
      `INSERT INTO users (username, full_name, password, organization_id, role)
       VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [username, full_name, hashedPassword, organization_id, role || 'adoptee']
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  } finally {
    client.release();
  }
};

// Update user
exports.updateUser = async (req, res) => {
  const client = await pool.connect();
  try {
    const { username, full_name, password, organization_id, role } = req.body;
    const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;

    const fields = [username, full_name, hashedPassword, organization_id, role || 'adoptee', req.params.uid];
    const result = await client.query(
      `UPDATE users SET username=$1, full_name=$2,
       password=COALESCE($3,password), organization_id=$4, role=$5
       WHERE uid=$6 RETURNING *`,
      fields
    );

    if (result.rows.length === 0) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  } finally {
    client.release();
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  const client = await pool.connect();
  try {
    const result = await client.query('DELETE FROM users WHERE uid=$1 RETURNING *', [req.params.uid]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'User not found' });
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
};
