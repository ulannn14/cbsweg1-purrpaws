const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

async function main() {
  // Hash the new password you want to set
  const newPassword = "org123";
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // Get all organizations
  const organizations = await prisma.organization.findMany();

  for (const org of organizations) {
    const updatedOrg = await prisma.organization.update({
      where: { id: org.id },
      data: { password: hashedPassword },
    });

    console.log(`Updated password for organization: ${updatedOrg.name}`);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());