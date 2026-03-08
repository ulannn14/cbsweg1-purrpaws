require('dotenv').config();

const express = require('express');
const cors = require('cors');

const { connectDB } = require('./config/db');

const app = express();

// Connect to PostgreSQL
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const catRoutes = require('./routes/cats');
const userRoutes = require('./routes/users');
//const orgRoutes = require('./routes/organizations');
//const authController = require('../controllers/authController');

app.use('/api/cats', catRoutes);
app.use('/api/users', userRoutes);
//app.use('/api/organizations', orgRoutes);

// Login route
//router.post('/login', authController.loginUser);

// Health check endpoint
app.get('/', (req, res) => {
  res.send('PurrPaws API is running');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
