require('dotenv').config();

const express = require('express');
const cors = require('cors');

const { connectDB } = require('./config/db');

const app = express();

// connect to PostgreSQL
connectDB();

app.use(cors());
app.use(express.json());

// routes
const catRoutes = require('./routes/cats');
app.use('/api/cats', catRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});