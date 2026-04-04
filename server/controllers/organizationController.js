// controllers/organizationController.js
const prisma = require("../config/prisma");
const bcrypt = require("bcrypt");
const supabase = require("../config/supabase");
const path = require("path");

const generateFileName = (file, folder, entityId = "general") => {
  const ext = file.originalname
    ? path.extname(file.originalname)
    : ".jpg";

  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);

  return `${folder}/${entityId}/${timestamp}-${random}${ext}`;
};

const uploadToSupabase = async (file, folder, entityId) => {
  if (!file) return null;

  const filePath = generateFileName(file, folder, entityId);

  const { data, error } = await supabase.storage
    .from("userImages")
    .upload(filePath, file.buffer, {
      contentType: file.mimetype,
    });

  console.log("Supabase data:", data);
  console.log("Supabase error:", error);

  if (error) throw error;

  const publicUrl = supabase.storage
    .from("userImages")
    .getPublicUrl(data.path).data.publicUrl;

  return publicUrl;
};

// GET organizations
exports.getOrganizations = async (req, res) => {
  try {

    const organizations = await prisma.organization.findMany({
      include: {
        province: true,
        pets: {
          include: {
            breed: true}
          }
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

// GET single organization by ID
exports.getOrganizationById = async (req, res) => {
  try {

    const { id } = req.params;

    const org = await prisma.organization.findUnique({
      where: { id },
      include: {
        province: true,
        pets: {
          include: {
            breed: true}
          }
      }
    });

    if (!org) {
      return res.status(404).json(null);
    }

    res.json(org);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch organization" });
  }
};

exports.updateOrganization = async (req, res) => {

  console.log("FILE:", req.file);
  
  try {
    const { id } = req.params;

    const removeImage = req.body.removeImage === "true";

    let imageUrl;

    if (removeImage) {
      imageUrl = null;
    } else if (req.file) {
      imageUrl = await uploadToSupabase(
      req.file,
      "organizationImages",
      id
     );
    }

    const updatedOrg = await prisma.organization.update({
      where: { id },
      data: {
        email: req.body.email,
        name: req.body.name,
        yearEstablished: req.body.yearEstablished,
        city: req.body.city,
        address: req.body.address,
        contactPerson: req.body.contactPerson,
        contactPersonRole: req.body.contactPersonRole,
        contactNumber: req.body.contactNumber,

        ...(imageUrl !== undefined && { organizationImage: imageUrl }),
      },
    });

    console.log("Saved image:", updatedOrg.organizationImage);

    if (req.file) {
      console.log("Uploading file...");
    }

    res.json(updatedOrg);

  } catch (error) {
    console.error("UPDATE ORG ERROR:", error);
    res.status(500).json({ error: "Failed to update organization" });
  }
};