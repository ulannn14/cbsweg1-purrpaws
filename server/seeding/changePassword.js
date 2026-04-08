const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("test123", 10);

  const updatedUser = await prisma.user.update({
    where: {
      email: "juandelacruz@gmail.com",
    },
    data: {
      password: hashedPassword,
    },
  });

  console.log("Password updated for:", updatedUser.email);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());