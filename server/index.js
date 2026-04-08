require('dotenv').config();

const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
const allowedOrigins = [
  "http://localhost:5173", // local dev (Vite)
  "https://cbsweg1-purrpaws.vercel.app" // deployed frontend
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));
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

app.get("/api/breeds", async (req, res) => {
  try {
    const breeds = await prisma.breed.findMany({
      orderBy: { name: "asc" }
    });

    res.json(breeds);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/api/snippet", async (req, res) => {
  try {
    const { forUser } = req.query;

    const filters = {};

    if (forUser !== undefined) {
      filters.forUser = forUser === "true";
    }

    // get all matching
    const snippets = await prisma.infoSnippet.findMany({
      where: filters,
    });

    if (snippets.length === 0) {
      return res.json(null);
    }

    // pick random
    const randomIndex = Math.floor(Math.random() * snippets.length);
    const randomSnippet = snippets[randomIndex];

    res.json({
      ...randomSnippet,
      id: randomSnippet.id.toString()
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/api/vaccines", async (req, res) => {
  try {
    const vaccines = await prisma.vaccine.findMany({
      orderBy: { name: "asc" }
    });

      res.json(vaccines);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/api/conditions", async (req, res) => {
  try {
    const conditions = await prisma.medicalCondition.findMany({
      orderBy: { name: "asc" }
    });

      res.json(conditions);
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