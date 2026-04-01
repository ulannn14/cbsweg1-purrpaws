const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

async function main() {

  const hashedPassword = await bcrypt.hash("test123", 10);

  const users = [
    {
      email: "mac@penta.com",
      firstName: "Mac",
      lastName: "Orcullo",
      userName: "mac",
      birthdate: new Date("2000-01-01"),
      city: "Quezon City",
      provinceId: 50,
      address: "Mac Address",
      phoneNumber: "09171234501"
    },
    {
      email: "leigh@penta.com",
      firstName: "Leigh",
      lastName: "Albo",
      userName: "leigh",
      birthdate: new Date("2000-01-01"),
      city: "Manila",
      provinceId: 50,
      address: "Leigh Address",
      phoneNumber: "09171234502"
    },
    {
      email: "Matthew@penta.com",
      firstName: "Matthew",
      lastName: "Fajardo",
      userName: "matthew",
      birthdate: new Date("2000-01-01"),
      city: "Makati",
      provinceId: 50,
      address: "Matthew Address",
      phoneNumber: "09171234503"
    },
    {
      email: "Lian@penta.com",
      firstName: "Lian",
      lastName: "Barte",
      userName: "lian",
      birthdate: new Date("2000-01-01"),
      city: "Taguig",
      provinceId: 50,
      address: "Lian Address",
      phoneNumber: "09171234504"
    },
    {
      email: "Azzam@penta.com",
      firstName: "Azzam",
      lastName: "Alonto",
      userName: "azzam",
      birthdate: new Date("2000-01-01"),
      city: "Pasig",
      provinceId: 50,
      address: "Azzam Address",
      phoneNumber: "09171234505"
    }
  ];

  for (const u of users) {
    const user = await prisma.user.create({
      data: {
        ...u,
        password: hashedPassword
      }
    });

    console.log("Created:", user.email);
  }

}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());