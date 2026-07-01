const path = require('path')
require('dotenv').config({
  path: path.resolve(__dirname, '../../.env'),
})

const seedData = {
  roles: [
    {
      name: 'admin',
      permissions: ['manage:all', 'read:reports', 'write:settings'],
    },
    {
      name: 'organizer',
      permissions: ['read:participants', 'write:participants', 'read:sessions'],
    },
    {
      name: 'scanner',
      permissions: ['read:participants', 'write:scans'],
    },
  ],
  users: [
    {
      fullName: 'Mushfik Admin',
      email: 'mushfik.cse@gmail.com',
      passwordHash: 'demo-admin-password',
      roleName: 'admin',
    },
  ],
  participants: [
    {
      fullName: 'Araf Rahman',
      institution: 'Dhaka Medical College',
      country: 'Bangladesh',
      email: 'araf@example.com',
      phone: '+8801700000001',
      category: 'Speaker',
      registrationRef: 'ICADHI-0001',
    },
    {
      fullName: 'Nila Islam',
      institution: 'North South University',
      country: 'Bangladesh',
      email: 'nila@example.com',
      phone: '+8801700000002',
      category: 'Participant',
      registrationRef: 'ICADHI-0002',
    },
  ],
  sessions: [
    {
      title: 'Opening Keynote',
      hall: 'Hall A',
      capacity: 300,
    },
    {
      title: 'AI in Digital Health',
      hall: 'Hall B',
      capacity: 180,
    },
  ],
  settings: [
    { key: 'congressName', value: 'ICADHI 2026' },
    { key: 'timezone', value: 'Asia/Dhaka' },
  ],
}

async function main() {
  if (!process.env.DATABASE_URL) {
    console.log('DATABASE_URL is not set. Seed data is ready but was not written.')
    console.log(JSON.stringify(seedData, null, 2))
    return
  }

  let PrismaClient
  try {
    PrismaClient = require('@prisma/client').PrismaClient
  } catch {
    console.log('@prisma/client is not installed. Run Prisma generate/install before seeding.')
    return
  }

  const prisma = new PrismaClient()

  try {
    for (const role of seedData.roles) {
      await prisma.role.upsert({
        where: { name: role.name },
        update: {},
        create: {
          name: role.name,
        },
      })
    }

    for (const user of seedData.users) {
      const role = await prisma.role.findUnique({ where: { name: user.roleName } })
      if (!role) {
        continue
      }

      await prisma.user.upsert({
        where: { email: user.email },
        update: {
          fullName: user.fullName,
          roleId: role.id,
        },
        create: {
          fullName: user.fullName,
          email: user.email,
          passwordHash: user.passwordHash,
          roleId: role.id,
        },
      })
    }

    for (const participant of seedData.participants) {
      await prisma.participant.upsert({
        where: { email: participant.email },
        update: participant,
        create: participant,
      })
    }

    for (const session of seedData.sessions) {
      await prisma.session.create({ data: session })
    }

    for (const setting of seedData.settings) {
      await prisma.setting.upsert({
        where: { key: setting.key },
        update: { value: setting.value },
        create: setting,
      })
    }
  } finally {
    await prisma.$disconnect()
  }
}

if (require.main === module) {
  main().catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
}

module.exports = { main, seedData }
