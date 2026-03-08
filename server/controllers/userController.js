const bcrypt = require('bcrypt');
const pool = require('../config/db'); // PostgreSQL pool

// --------------------------
// CREATE USER (Sign Up)
// --------------------------
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

    // Check if email or username already exists
    const userExists = await pool.query(
      'SELECT * FROM users WHERE email = $1 OR username = $2',
      [email, username]
    );
    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: 'Email or username already exists' });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert user into DB
    const newUser = await pool.query(
      `INSERT INTO users (first_name, last_name, email, mobile, username, password, birthdate, city, province, address)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
       RETURNING id, first_name, last_name, email, username, birthdate, city, province, address`,
      [firstName, lastName, email, mobile, username, hashedPassword, birthdate, city, province, address]
    );

    res.status(201).json(newUser.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// --------------------------
// LOGIN USER
// --------------------------
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const userQuery = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = userQuery.rows[0];

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Remove password from user object before sending
    delete user.password;

    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
