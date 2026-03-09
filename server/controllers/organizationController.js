// controllers/organizationController.js
const prisma = require("../config/prisma");
const bcrypt = require("bcrypt");

// GET organizations
exports.getOrganizations = async (req, res) => {
  try {

    const organizations = await prisma.organization.findMany({
      include: {
        province: true,
        pets: true
      }
    });

    res.json(organizations);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch organizations" });
  }
};


// LOGIN organization
exports.loginOrganization = async (req, res) => {
  try {

    const { email, password } = req.body;

    const org = await prisma.organization.findUnique({
      where: { email }
    });

    if (!org) {
      return res.status(404).json({ message: "Organization not found" });
    }

    const validPassword = await bcrypt.compare(password, org.password);

    if (!validPassword) {
      return res.status(401).json({ message: "Invalid password" });
    }

    res.json({
      id: org.id,
      name: org.name,
      email: org.email
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};