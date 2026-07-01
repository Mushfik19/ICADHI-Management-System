let prisma = null
let loadError = null

function getPrisma() {
  if (loadError) {
    return null
  }

  if (prisma) {
    return prisma
  }

  try {
    const { PrismaClient } = require('@prisma/client')
    prisma = new PrismaClient()
    return prisma
  } catch (error) {
    loadError = error
    return null
  }
}

module.exports = { getPrisma }
