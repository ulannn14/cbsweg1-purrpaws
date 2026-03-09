const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {

  // create another province
  const cavite = await prisma.province.upsert({
    where: { name: "Cavite" },
    update: {},
    create: { name: "Cavite" }
  });

  // create organization in Cavite
  const org = await prisma.organization.create({
    data: {
      name: "Cavite Paw Rescue",
      email: "cavitepaw@example.com",
      contactPerson: "Ana Cruz",
      contactNumber: "09123456789",
      password: "test123",
      organizationType: "Shelter",
      city: "Dasmariñas",
      provinceId: cavite.id,
      address: "Sample Address Cavite",
      yearEstablished: new Date("2018-01-01"),
      socialMediaLinks: [],
      status: "BOTH",
      numberOfAnimals: 10,
      description: "Rescue shelter in Cavite"
    }
  });

  // create breed if needed
  const breed = await prisma.breed.findFirst({
    where: { name: "Aspin" }
  }) || await prisma.breed.create({
    data: {
      name: "Aspin",
      isCat: false
    }
  });

  // create pet
  const pet = await prisma.pets.create({
    data: {
      name: "Bantay",
      isMale: true,
      age: 3,
      size: "MEDIUM",
      weight: 15,
      color: "Brown",
      organizationId: org.id,
      breedId: breed.id,
      rescueStory: "Found wandering in Cavite streets",
      dateRescued: new Date(),
      adoptionReason: "Needs loving home",
      temperament: "FRIENDLY",
      isSpayedOrNeutered: true,
      isGoodWithDogs: true,
      isGoodWithCats: false,
      isGoodWithKids: true,
      isHouseTrained: false,
      isLeashTrained: true,
      adoptionFee: 500,
      adoptionRequirements: ["Home visit"]
    }
  });

  console.log("Created Cavite organization and pet:", pet);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());