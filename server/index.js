require('dotenv').config();

const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const catRoutes = require('./routes/cats');
const userRoutes = require('./routes/users');

app.use('/api/cats', catRoutes);
app.use('/api/users', userRoutes);

// Health check endpoint
app.get('/', (req, res) => {
  res.send('PurrPaws API is running');
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});