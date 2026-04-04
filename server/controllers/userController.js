const bcrypt = require('bcrypt');
const prisma = require('../config/prisma');
const supabase = require("../config/supabase");
const path = require("path");

const normalizeFiles = (files) => {
  if (!files) return [];
  return Array.isArray(files) ? files : [files];
};

const generateFileName = (file, folder, entityId = "general") => {
  const ext = file.originalname
    ? path.extname(file.originalname)
    : ".jpg";

  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);

  return `${folder}/${entityId}/${timestamp}-${random}${ext}`;
};

const uploadToSupabase = async (fileArray, folder, entityId = "general") => {
  const uploads = (fileArray || []).map(async (file) => {
    const filePath = generateFileName(file, folder, entityId);

    const { data, error } = await supabase.storage
      .from("userImages")
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
      });

    if (error) throw error;

    return supabase.storage
      .from("userImages")
      .getPublicUrl(data.path).data.publicUrl;
  });

  return await Promise.all(uploads);
};


// GET ALL USERS
exports.getUsers = async (req, res) => {
  try {

    const users = await prisma.user.findMany({
      select: {
        id: true,
        userImage: true,
        firstName: true,
        lastName: true,
        email: true,
        userName: true,
        birthdate: true,
        city: true,
        address: true,
        provinceId: true,
        phoneNumber: true
      }
    });

    res.status(200).json(users);

  } catch (err) {

    console.error(err);
    res.status(500).json({ message: 'Server error' });

  }
};



// GET SINGLE USER
exports.getUserById = async (req, res) => {

  const { id } = req.params;

  try {

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        userImage: true,
        firstName: true,
        lastName: true,
        email: true,
        userName: true,
        birthdate: true,
        city: true,
        address: true,
        provinceId: true,
        phoneNumber: true
      }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);

  } catch (err) {

    console.error(err);
    res.status(500).json({ message: 'Server error' });

  }
};



// UPDATE USER
exports.updateUser = async (req, res) => {
  const { id } = req.params;

  try {
    const files = req.files || {};
    const userImages = normalizeFiles(files.userImage);

    let imageUrls = [];

    if (userImages.length > 0) {
      imageUrls = await uploadToSupabase(
        userImages,
        "userImages",
        id
      );
    }

    // Remove id from body
    const { id: _, birthdate, provinceId, ...rest } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        ...rest,

        ...(provinceId && {
          provinceId: Number(provinceId)
        }),

        ...(birthdate && {
          birthdate: new Date(birthdate)
        }),

        ...(imageUrls.length > 0 && {
          userImage: imageUrls[0],
          userImages: imageUrls
        })
      }
    });

    const { password, ...userWithoutPassword } = updatedUser;

    res.status(200).json(userWithoutPassword);

  } catch (err) {
    if (err.code === "P2025") {
      return res.status(404).json({ message: "User not found" });
    }

    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};



// LOGIN
exports.loginUser = async (req, res) => {

  const { email, password } = req.body;

  try {

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const { password: _, ...userWithoutPassword } = user;

    res.status(200).json(userWithoutPassword);

  } catch (err) {

    console.error(err);
    res.status(500).json({ message: "Server error" });

  }
};



// CREATE USER
exports.createUser = async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    userName,
    password,
    birthdate,
    city,
    provinceId,
    address,
    phoneNumber
  } = req.body;

  try {
    const existing = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { userName }]
      }
    });

    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user FIRST
    const newUser = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        userName,
        password: hashedPassword,
        birthdate: new Date(birthdate),
        city,
        provinceId: Number(provinceId),
        address,
        phoneNumber,
        userImage: null,
        userImages: []
      }
    });

    // Handle image upload USING user id
    const files = req.files || {};
    const userImages = normalizeFiles(files.userImage);

    let imageUrls = [];

    if (userImages.length > 0) {
      imageUrls = await uploadToSupabase(
        userImages,
        "userImages",   
        newUser.id      
      );

      // Update user with image
      await prisma.user.update({
        where: { id: newUser.id },
        data: {
          userImage: imageUrls[0],
          userImages: imageUrls
        }
      });
    }

    const { password: _, ...userWithoutPassword } = newUser;

    res.status(201).json({
      ...userWithoutPassword,
      userImage: imageUrls[0] || null
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


// DELETE USER
exports.deleteUser = async (req, res) => {

  const { id } = req.params;

  try {

    await prisma.user.delete({
      where: { id }
    });

    res.status(200).json({ message: 'User deleted successfully' });

  } catch (err) {

    if (err.code === 'P2025') {
      return res.status(404).json({ message: 'User not found' });
    }

    console.error(err);
    res.status(500).json({ message: 'Server error' });

  }
};