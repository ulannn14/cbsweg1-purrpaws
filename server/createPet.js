const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {

  // Find province
  const province = await prisma.province.findFirst({
    where: { name: "Laguna" }
  });

  console.log("Using province:", province);

  // Find organization
  const organization = await prisma.organization.findFirst({
    where: { email: "rescue@email.com" }
  });

  console.log("Using organization:", organization);

  // Find or create breed
  let breed = await prisma.breed.findFirst({
    where: { name: "Domestic Shorthair" }
  });

  if (!breed) {
    breed = await prisma.breed.create({
      data: {
        name: "Domestic Shorthair",
        isCat: true
      }
    });
  }

  console.log("Using breed:", breed);

  // Create pet
  const pet = await prisma.pets.create({
    data: {
      organizationId: organization.id,
      name: "Milo",
      isMale: true,
      age: 2,
      size: "SMALL",
      weight: 4.5,
      color: "Orange",
      breedId: breed.id,
      rescueStory: "Found abandoned near market",
      dateRescued: new Date(),
      adoptionReason: "Looking for loving home",
      temperament: "PLAYFUL",
      isSpayedOrNeutered: true,
      isGoodWithDogs: true,
      isGoodWithCats: true,
      isGoodWithKids: true,
      isHouseTrained: true,
      isLeashTrained: false,
      adoptionFee: 500,
      adoptionRequirements: ["Valid ID", "Home Visit"]
    }
  });

  console.log("Pet created:", pet);
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });