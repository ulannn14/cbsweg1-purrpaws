const mongoose = require('mongoose');
const Cat = require('./models/Cat');
const Organization = require('./models/Organization');

mongoose.connect('mongodb://localhost:27017/catAdoptionDB')
  .then(() => console.log('MongoDB Connected for Seeding'))
  .catch(err => console.log(err));

const seedDatabase = async () => {
  try {
    // 🔥 Clear existing data (optional but recommended)
    await Cat.deleteMany({});
    await Organization.deleteMany({});

    console.log("Old data cleared");

    // 🏢 Create Organizations first
    const org1 = await Organization.create({
      name: "Paws Rescue",
      address: "Manila",
      contactInfo: {
        facebook: "facebook.com/paws",
        email: "paws@email.com",
        instagram: "@paws"
      }
    });

    const org2 = await Organization.create({
      name: "Happy Tails",
      address: "Quezon City"
    });

    console.log("Organizations created");

    // 🐱 Create Cats linked to organizations
    await Cat.create([
      {
        name: "Mingming",
        age: 2,
        breed: "Persian",
        gender: "Female",
        organizationId: org1._id
      },
      {
        name: "Snowball",
        age: 1,
        breed: "Siamese",
        gender: "Male",
        organizationId: org2._id
      }
    ]);

    console.log("Cats created");

    process.exit();
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

seedDatabase();