require('dotenv').config();


const express = require('express');
const cors = require('cors');

const connectDB = require('./config/db');

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

const catRoutes = require('./routes/cats');
const { connect } = require('mongoose');
app.use('/api/cats', catRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});