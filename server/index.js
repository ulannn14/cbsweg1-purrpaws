require('dotenv').config();  // MUST be first

const express = require('express');
const cors = require('cors');

const connectDB = require('./config/db');

connectDB();  // now env is available

const app = express();

app.use(cors());
app.use(express.json());

const catRoutes = require('./routes/cats');
app.use('/api/cats', catRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});