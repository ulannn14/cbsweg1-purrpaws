const { pool } = require('../config/db');
const bcrypt = require('bcrypt');

/**
 * POST /api/users/login
 * Log in a user using email (username) and password
 */
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const client = await pool.connect();
  try {
    const result = await client.query(
      `SELECT * FROM users WHERE email=$1 OR username=$1`,
      [email]
    );

    const user = result.rows[0];
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // remove password from response
    delete user.password;

    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  } finally {
    client.release();
  }
};
