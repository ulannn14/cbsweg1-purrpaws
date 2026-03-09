const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

async function main() {

  const hashedPassword = await bcrypt.hash("test123", 10);

  await prisma.organization.updateMany({
    data: {
      password: hashedPassword
    }
  });

  console.log("✅ Organization passwords updated and hashed!");

}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());