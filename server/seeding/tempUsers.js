const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcrypt')

const prisma = new PrismaClient()

async function main() {
  const hashedPassword = await bcrypt.hash('test123', 10)

  await prisma.user.create({
    data: {
      email: 'lian@penta.com',
      firstName: 'Lian',
      lastName: 'Barte',
      userName: 'lian123',
      password: hashedPassword,
      birthdate: new Date('2000-01-01'),
      city: 'Quezon City',
      provinceId: 1,
      address: 'Sample Address',
      phoneNumber: '09123456789',
      userImages: [],
    },
  })

  console.log('✅ Seeded user')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())