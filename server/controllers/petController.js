const prisma = require("../config/prisma");


exports.getPets = async (req, res) => {
  try {

    const { provinceId, age_min, age_max, organizationId } = req.query;

    const pets = await prisma.pets.findMany({

      where: {

        // org filter (for clickable org header)
        ...(organizationId && {
          organizationId: organizationId
        }),

        // province filter
        ...(provinceId && {
          organization: {
            provinceId: Number(provinceId)
          }
        }),

        // age filter
        ...((age_min || age_max) && {
          age: {
            ...(age_min && { gte: Number(age_min) }),
            ...(age_max && { lte: Number(age_max) })
          }
        })

      },

      include: {
        breed: true,
        organization: true
      },

      orderBy: {
        name: "asc"
      }

    });

    res.json(pets);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get single pet
exports.getPetById = async (req, res) => {
  try {

    const pet = await prisma.pets.findUnique({
      where: {
        id: req.params.id
      },
      include: {
        breed: true,
        organization: true
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

    const newPet = await prisma.pets.create({
      data: req.body
    });

    res.status(201).json(newPet);

  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
};


// Update pet
exports.updatePet = async (req, res) => {
  try {

    const updatedPet = await prisma.pets.update({
      where: {
        id: req.params.id
      },
      data: req.body
    });

    res.status(200).json(updatedPet);

  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
};


// Delete pet
exports.deletePet = async (req, res) => {
  try {

    await prisma.pets.delete({
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