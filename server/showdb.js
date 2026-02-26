const mongoose = require('mongoose');

const uri = 'mongodb://localhost:27017/catAdoptionDB';

async function viewAllCollections() {
  try {
    await mongoose.connect(uri);
    console.log("MongoDB Connected");

    const db = mongoose.connection.db;

    const collections = await db.listCollections().toArray();

    for (let collection of collections) {
      console.log(`\n===== ${collection.name.toUpperCase()} =====`);

      const data = await db
        .collection(collection.name)
        .find({})
        .toArray();

      console.log(JSON.stringify(data, null, 2));
    }

    await mongoose.disconnect();
  } catch (err) {
    console.error(err);
  }
}

viewAllCollections();