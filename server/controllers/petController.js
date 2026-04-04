const e = require("express");
const prisma = require("../config/prisma");
const supabase = require("../config/supabase");
const path = require("path");

// Always return an array
const normalizeFiles = (files) => {
  if (!files) return [];
  return Array.isArray(files) ? files : [files];
};

// Safe + unique filename generator
const generateFileName = (file, folder, entityId = "general") => {
  const ext = file.originalname
    ? path.extname(file.originalname)
    : ".jpg";

  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);

  return `${folder}/${entityId}/${timestamp}-${random}${ext}`;
};

exports.createPet = async (req, res) => {
  try {
    const files = req.files || {};
    const petImages = normalizeFiles(files.petImages);

    if (!req.body?.organizationId) {
      return res.status(400).json({
        message: "organizationId is required"
      });
    }

    const newPet = await prisma.pet.create({
      data: {
        organization: {
          connect: { id: req.body.organizationId }
        },
        name: req.body.name,
        isMale: req.body.isMale === "true",
        age: req.body.age ? Number(req.body.age) : null,
        size: req.body.size,
        weight: req.body.weight ? Number(req.body.weight) : null,
        color: req.body.color,
        breed: {
          connect: { id: Number(req.body.breedId) }
        },
        rescueStory: req.body.rescueStory,
        temperament: req.body.temperament,
        isSpayedOrNeutered: req.body.isSpayedOrNeutered === "true",
        isGoodWithDogs: req.body.isGoodWithDogs === "true",
        isGoodWithCats: req.body.isGoodWithCats === "true",
        isGoodWithKids: req.body.isGoodWithKids === "true",
        isHouseTrained: req.body.isHouseTrained === "true",
        isLeashTrained: req.body.isLeashTrained === "true",
        adoptionFee: req.body.adoptionFee
          ? Number(req.body.adoptionFee)
          : null,
        adoptionRequirements: req.body.adoptionRequirements
          ? JSON.parse(req.body.adoptionRequirements)
          : [],
        adoptionStatus: req.body.adoptionStatus || "AVAILABLE",
        dateRescued: req.body.dateRescued
          ? new Date(req.body.dateRescued)
          : null,
        petImages: [],
        petImage: null
      }
    });

    let imageUrls = [];

    if (petImages.length > 0) {
      imageUrls = await uploadToSupabase(
        petImages,
        "petImages",
        newPet.id
      );
    }

    const updatedPet = await prisma.pet.update({
      where: { id: newPet.id },
      data: {
        petImages: imageUrls,
        petImage: imageUrls[0] || null
      }
    });

    res.status(201).json(updatedPet);

  } catch (error) {
    console.error("CREATE PET ERROR:", error);
    res.status(400).json({ message: error.message });
  }
};

exports.getPets = async (req, res) => {

  const { limit } = req.query;

  try {

    const {
      provinceId,
      age_min,
      age_max,
      organizationId,
      species,
      isMale,
      isNeutered,
      fee_min,
      fee_max,
      status
    } = req.query;

    const pets = await prisma.pet.findMany({

      where: {

        // org filter
        ...(organizationId && {
          organizationId: organizationId
        }),

        // province filter
        ...(provinceId && {
          organization: {
            provinceId: Number(provinceId)
          }
        }),

        // species filter (now using breed.isCat)
        ...(species && {
          breed: {
            isCat: species === "cat"
          }
        }),

        // sex filter
        ...(isMale !== undefined && isMale !== "" && {
          isMale: isMale === "true"
        }),

        // neutered filter
        ...(isNeutered !== undefined && isNeutered !== "" && {
          isSpayedOrNeutered: isNeutered === "true"
        }),

        // age filter
        ...((age_min || age_max) && {
          age: {
            ...(age_min && { gte: Number(age_min) }),
            ...(age_max && { lte: Number(age_max) })
          }
        }),

        // adoption fee filter
        ...((fee_min || fee_max) && {
          adoptionFee: {
            ...(fee_min && { gte: Number(fee_min) }),
            ...(fee_max && { lte: Number(fee_max) })
          }
        }),

        ...(status && {
          adoptionStatus: status
        })

      },

      ...(limit && { take: Number(limit) }),

      include: {
        breed: true,
        organization: {
          include: {
            province: true
          }
        },
        petConditions: {
          include: {
            condition: true
          }
        },
        vaccinations: {
          include: {
            vaccine: true
          }
        }
      },

      orderBy: {
        age: "desc"
      }

    });

    res.json(pets);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }

};

exports.getPetById = async (req, res) => {

  try {

    const pet = await prisma.pet.findUnique({
      where: {
        id: req.params.id
      },
      include: {
        breed: true,
        organization: {
          include: {
            province: true
          }
        },
        petConditions: {
          include: {
            condition: true
          }
        },
        vaccinations: {
          include: {
            vaccine: true
          } 
        }
      }
    });

    if (!pet) {
      return res.status(404).json({ message: "Pet not found" });
    }

    res.status(200).json(pet);

  } catch (error) {

    console.error(error);
    res.status(500).json({ message: "Server error" });

  }

};

// Create new pet
exports.createPet = async (req, res) => {
  try {
    const files = req.files || {};

    if (!req.body?.organizationId) {
      return res.status(400).json({
        message: "organizationId is required"
      });
    }

    const newPet = await prisma.pet.create({
      data: {
        organization: {
          connect: { id: req.body.organizationId }
        },

        name: req.body.name,
        isMale: req.body.isMale === "true",

        age: req.body.age ? Number(req.body.age) : null,
        size: req.body.size,
        weight: req.body.weight ? Number(req.body.weight) : null,
        color: req.body.color,

        breed: {
          connect: { id: Number(req.body.breedId) }
        },

        rescueStory: req.body.rescueStory,
        temperament: req.body.temperament,

        isSpayedOrNeutered: req.body.isSpayedOrNeutered === "true",
        isGoodWithDogs: req.body.isGoodWithDogs === "true",
        isGoodWithCats: req.body.isGoodWithCats === "true",
        isGoodWithKids: req.body.isGoodWithKids === "true",
        isHouseTrained: req.body.isHouseTrained === "true",
        isLeashTrained: req.body.isLeashTrained === "true",

        adoptionFee: req.body.adoptionFee
          ? Number(req.body.adoptionFee)
          : null,

        adoptionRequirements: req.body.adoptionRequirements
          ? JSON.parse(req.body.adoptionRequirements)
          : [],

        adoptionStatus: req.body.adoptionStatus || "AVAILABLE",

        dateRescued: req.body.dateRescued
          ? new Date(req.body.dateRescued)
          : null,

        // temporary empty
        petImages: [],
        petImage: null
      }
    });

    let imageUrls = [];

    if (files.petImages && files.petImages.length > 0) {
      imageUrls = await uploadToSupabase(
        files.petImages,
        "petImages",
        newPet.id
      );
    }

    const updatedPet = await prisma.pet.update({
      where: { id: newPet.id },
      data: {
        petImages: imageUrls,
        petImage: imageUrls.length > 0 ? imageUrls[0] : null
      }
    });

    res.status(201).json(updatedPet);

  } catch (error) {
    console.error("CREATE PET ERROR:", error);
    res.status(400).json({ message: error.message });
  }
};

const uploadToSupabase = async (fileArray, folder, entityId = "general") => {
  const uploads = (fileArray || []).map(async (file) => {
    const filePath = generateFileName(file, folder, entityId);

    const { data, error } = await supabase.storage
      .from("public-assets")
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
      });

    console.log("UPLOAD RESULT:", { data, error });

    if (error) throw error;

    return supabase.storage
      .from("public-assets")
      .getPublicUrl(data.path).data.publicUrl;
  });

  return await Promise.all(uploads);
};

exports.updatePet = async (req, res) => {
  try {
    const files = req.files || {};
    
    // Upload images
    let imageUrls = [];

  const petImages = normalizeFiles(files.petImages);

  if (petImages.length > 0) {
      imageUrls = await uploadToSupabase(
      petImages,
      "petImages",
      req.params.id
    );
  }

    // Merge existing + new
    const existingImages = req.body.existingImages
    ? JSON.parse(req.body.existingImages)
    : [];

    const finalImages = [...existingImages, ...imageUrls];
    const uniqueImages = [...new Set(finalImages)]; // Remove duplicates if any

    const mainImage = finalImages.length > 0 ? finalImages[0] : null;

    console.log("existingImages:", req.body.existingImages);
    console.log("files:", req.files);

    // Parse arrays
    let adoptionRequirements = req.body.adoptionRequirements;
    if (typeof adoptionRequirements === "string") {
      adoptionRequirements = JSON.parse(adoptionRequirements);
    }

    let conditionIds = [];
    if (req.body.conditionIds) {
      conditionIds = JSON.parse(req.body.conditionIds);
    }

    let vaccineIds = [];
    if (req.body.vaccineIds) {
      vaccineIds = JSON.parse(req.body.vaccineIds);
    }

    const updatedPet = await prisma.pet.update({
      where: { id: req.params.id },
      data: {
        name: req.body.name,
        isMale: req.body.isMale === "true" || req.body.isMale === true,

        age: req.body.age ? Number(req.body.age) : null,
        size: req.body.size,
        weight: req.body.weight ? Number(req.body.weight) : null,
        color: req.body.color,

        breed: {
          connect: { id: Number(req.body.breedId) }
        },

        rescueStory: req.body.rescueStory,
        temperament: req.body.temperament,

        isSpayedOrNeutered: req.body.isSpayedOrNeutered === "true",
        isGoodWithDogs: req.body.isGoodWithDogs === "true",
        isGoodWithCats: req.body.isGoodWithCats === "true",
        isGoodWithKids: req.body.isGoodWithKids === "true",
        isHouseTrained: req.body.isHouseTrained === "true",
        isLeashTrained: req.body.isLeashTrained === "true",

        adoptionFee: req.body.adoptionFee ? Number(req.body.adoptionFee) : null,

        adoptionRequirements,

        adoptionStatus: req.body.adoptionStatus,

        dateRescued: req.body.dateRescued
          ? new Date(req.body.dateRescued)
          : null,

        // SAVE IMAGE URLs
        petImages: uniqueImages,
        petImage: uniqueImages[0] || null,

        // RELATIONS
        petConditions: {
          deleteMany: {},
          create: conditionIds.map(id => ({
            condition: { connect: { id } }
          }))
        },

        vaccinations: {
          deleteMany: {},
          create: vaccineIds.map(id => ({
            vaccine: { connect: { id } }
          }))
        }
      }
    });

    res.json(updatedPet);

  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
};



// Delete pet
exports.deletePet = async (req, res) => {

  try {

    await prisma.pet.delete({
      where: {
        id: req.params.id
      }
    });

    res.status(200).json({ message: "Pet deleted successfully" });

  } catch (error) {

    console.error(error);
    res.status(500).json({ message: error.message });

  }

};