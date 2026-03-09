const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {

  // ---------- Provinces ----------
  const provinceNames = [
    "Laguna",
    "Cavite",
    "Batangas",
    "Rizal",
    "Quezon"
  ];

  const provinces = [];

  for (const name of provinceNames) {
    const province = await prisma.province.create({
      data: { name }
    });
    provinces.push(province);
  }

  // ---------- Breeds (7 total) ----------
  const breedData = [
    { name: "Domestic Shorthair", isCat: true },
    { name: "Persian", isCat: true },
    { name: "Siamese", isCat: true },
    { name: "Aspin", isCat: false },
    { name: "Shih Tzu", isCat: false },
    { name: "Labrador", isCat: false },
    { name: "Beagle", isCat: false }
  ];

  const breeds = [];

  for (const breed of breedData) {
    const b = await prisma.breed.create({
      data: breed
    });
    breeds.push(b);
  }

  // ---------- Organizations ----------
  const orgNames = [
    "Laguna Animal Rescue",
    "Cavite Paw Haven",
    "Batangas Pet Shelter",
    "Rizal Rescue Center",
    "Quezon Animal Care"
  ];

  const orgs = [];

  for (let i = 0; i < 5; i++) {

    const org = await prisma.organization.create({
      data: {
        name: orgNames[i],
        email: `org${i}@test.com`,
        contactNumber: "09123456789",
        password: "test123",
        organizationType: "Shelter",
        city: "Sample City",
        provinceId: provinces[i].id,
        address: "Sample Address",
        yearEstablished: new Date("2018-01-01"),
        socialMediaLinks: [],
        status: "BOTH",
        numberOfAnimals: 10,
        description: "Animal rescue organization"
      }
    });

    orgs.push(org);
  }

  // ---------- Pets ----------
  const petNames = [
    "Milo",
    "Bantay",
    "Charlie",
    "Simba",
    "Coco",
    "Oreo",
    "Bella",
    "Rocky",
    "Shadow",
    "Max"
  ];

  let breedIndex = 0;
  let petIndex = 0;

  for (const org of orgs) {

    for (let i = 0; i < 2; i++) {

      const breed = breeds[breedIndex % breeds.length];

      await prisma.pets.create({
        data: {
          name: petNames[petIndex],
          species: breed.isCat ? "CAT" : "DOG",
          isMale: petIndex % 2 === 0,
          age: Math.floor(Math.random()*6)+1,
          size: "MEDIUM",
          weight: 10 + Math.random()*5,
          color: "Brown",
          organizationId: org.id,
          breedId: breed.id,
          rescueStory: "Rescued from streets",
          dateRescued: new Date(),
          adoptionReason: "Needs loving home",
          temperament: "FRIENDLY",
          isSpayedOrNeutered: true,
          isGoodWithDogs: true,
          isGoodWithCats: true,
          isGoodWithKids: true,
          isHouseTrained: false,
          isLeashTrained: true,
          adoptionFee: 500,
          adoptionRequirements: ["Home visit"]
        }
      });

      petIndex++;
      breedIndex++;
    }

  }

  console.log("✅ Database seeded successfully!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());