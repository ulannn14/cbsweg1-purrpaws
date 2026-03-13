const e = require("express");
const prisma = require("../config/prisma");

exports.addPet = async (req, res) => {

  try {

    const data = { ...req.body };

    // Convert JSON array
    if (data.adoptionRequirements) {
      data.adoptionRequirements = JSON.parse(data.adoptionRequirements);
    }

    // Convert date
    if (data.dateRescued) {
      data.dateRescued = new Date(data.dateRescued);
    }

    // Convert empty numbers
    if (data.age === "") data.age = null;
    if (data.weight === "") data.weight = null;
    if (data.adoptionFee === "") data.adoptionFee = null;

    const newPet = await prisma.pet.create({
      data
    });

    res.status(201).json(newPet);

  } catch (error) {

    console.error(error);
    res.status(500).json({ error: "Failed to create pet" });

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
        organization: true
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

    const newPet = await prisma.pet.create({
      data: {

        organization: {
          connect: { id: req.body.organizationId }
        },

        name: req.body.name,
        isMale: req.body.isMale,

        age: Number(req.body.age),
        size: req.body.size,
        weight: Number(req.body.weight),
        color: req.body.color,

        breed: {
          connect: { id: Number(req.body.breedId) }
        },

        rescueStory: req.body.rescueStory,
        adoptionReason: req.body.adoptionReason,
        temperament: req.body.temperament,

        isSpayedOrNeutered: req.body.isSpayedOrNeutered,
        isGoodWithDogs: req.body.isGoodWithDogs,
        isGoodWithCats: req.body.isGoodWithCats,
        isGoodWithKids: req.body.isGoodWithKids,
        isHouseTrained: req.body.isHouseTrained,
        isLeashTrained: req.body.isLeashTrained,

        adoptionFee: Number(req.body.adoptionFee),

        adoptionRequirements: req.body.adoptionRequirements,

        adoptionStatus: req.body.adoptionStatus || "AVAILABLE",

        dateRescued: req.body.dateRescued
          ? new Date(req.body.dateRescued)
          : null
      }
    });

    res.status(201).json(newPet);

  } catch (error) {

    console.error(error);
    res.status(400).json({ message: error.message });

  }

};



exports.updatePet = async (req, res) => {

  try {

    const updatedPet = await prisma.pet.update({
      where: { 
        id: req.params.id 
      },
      data: {

        name: req.body.name,
        isMale: req.body.isMale,

        age: Number(req.body.age),
        size: req.body.size,
        weight: Number(req.body.weight),
        color: req.body.color,

        breed: {
          connect: { id: Number(req.body.breedId) }
        },

        rescueStory: req.body.rescueStory,
        adoptionReason: req.body.adoptionReason,
        temperament: req.body.temperament,

        isSpayedOrNeutered: req.body.isSpayedOrNeutered,
        isGoodWithDogs: req.body.isGoodWithDogs,
        isGoodWithCats: req.body.isGoodWithCats,
        isGoodWithKids: req.body.isGoodWithKids,
        isHouseTrained: req.body.isHouseTrained,
        isLeashTrained: req.body.isLeashTrained,

        adoptionFee: Number(req.body.adoptionFee),

        adoptionRequirements: req.body.adoptionRequirements,

        adoptionStatus: req.body.adoptionStatus,

        dateRescued: req.body.dateRescued
          ? new Date(req.body.dateRescued)
          : null
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