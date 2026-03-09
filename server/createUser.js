const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

async function main() {
  // create province first
  const province = await prisma.province.upsert({
    where: { name: "Laguna" },
    update: {},
    create: {
      name: "Laguna"
    }
  });

  const hashedPassword = await bcrypt.hash("test123", 10);

  const user = await prisma.user.create({
    data: {
      email: "test@email.com",
      firstName: "Test",
      lastName: "User",
      userName: "testuser",
      password: hashedPassword,
      birthdate: new Date("2000-01-01"),
      city: "Laguna",
      provinceId: province.id,
      address: "Sample Address"
    }
  });

  console.log("User created:", user);
}

main().finally(() => prisma.$disconnect());