require('dotenv').config();
const mongoose = require('mongoose');

const Cat = require('./models/Cat');
const Organization = require('./models/Organization');

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Atlas Connected for Seeding'))
  .catch(err => console.log(err));

const seedDatabase = async () => {
  try {
    // 🔥 Clear existing data
    await Cat.deleteMany({});
    await Organization.deleteMany({});

    console.log("Old data cleared");

    // 🏢 Create Organizations
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

    // 🐱 Create Cats
    await Cat.create([
      {
        name: "Mingming",
        age: 2,
        breed: "Persian",
        gender: "Female",
        organizationId: org1._id,
        location: "Makati"
      },
      {
        name: "Snowball",
        age: 1,
        breed: "Siamese",
        gender: "Male",
        organizationId: org2._id,
        location: "Manila"
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