require('dotenv').config();

const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const petRoutes = require('./routes/pets');
const userRoutes = require('./routes/users');
const applicationRoutes = require('./routes/application');
const organizationRoutes = require('./routes/organizations');

app.use('/api/organizations', organizationRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/pets', petRoutes);
app.use('/api/users', userRoutes);

// Health check endpoint
app.get('/', (req, res) => {
  res.send('PurrPaws API is running');
});

const prisma = require("./config/prisma");

// short hack for dropdown data - ideally this would be in a separate route and cached on the client
app.get("/api/provinces", async (req, res) => {
  try {
    const provinces = await prisma.province.findMany({
      orderBy: { name: "asc" }
    });

    res.json(provinces);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});