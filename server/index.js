const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/db');
connectDB();

const app = express();

app.use(cors());
app.use(express.json());
const path = require('path');

// Serve static files from the client/public folder
app.use('/images', express.static(path.join(__dirname, '../client/public/images')));

const catRoutes = require('./routes/cats');
app.use('/api/cats', catRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
