const fs = require('node:fs')
const path = require('node:path')

process.env.NODE_ENV = process.env.NODE_ENV || 'launch-check'

const requiredFiles = [
  'package.json',
  'vite.config.js',
  'backend/package.json',
  'backend/src/server.js',
  'backend/src/prisma/schema.prisma',
  'backend/.env',
]

const apiPaths = [
  '/api/organizers',
  '/api/abstracts',
  '/api/accommodation',
  '/api/ai-analytics',
  '/api/badges',
  '/api/certificates',
  '/api/exhibition',
  '/api/finance',
  '/api/food',
  '/api/live-monitor',
  '/api/medical',
  '/api/notifications',
  '/api/participants',
  '/api/profile',
  '/api/reports',
  '/api/reviews',
  '/api/roles',
  '/api/security',
  '/api/sessions',
  '/api/settings',
  '/api/speakers',
  '/api/sponsors',
  '/api/transport',
  '/api/venue',
  '/api/volunteers',
  '/api/workshops',
  '/api/actions',
  '/api/ai/health',
]

function pass(message) {
  console.log(`[ok] ${message}`)
}

function fail(message) {
  console.error(`[fail] ${message}`)
  process.exitCode = 1
}

function assertRequiredFiles() {
  for (const file of requiredFiles) {
    if (fs.existsSync(path.resolve(file))) {
      pass(`${file} exists`)
    } else {
      fail(`${file} is missing`)
    }
  }
}

function assertBackendEnv() {
  const envPath = path.resolve('backend/.env')
  if (!fs.existsSync(envPath)) {
    return
  }

  const env = fs.readFileSync(envPath, 'utf8')
  if (/DATABASE_URL\s*=\s*"?mysql:\/\//.test(env)) {
    pass('backend/.env has a MySQL DATABASE_URL')
  } else {
    fail('backend/.env must contain a MySQL DATABASE_URL')
  }

  if (/PORT\s*=\s*4000/.test(env)) {
    pass('backend/.env uses backend port 4000')
  } else {
    fail('backend/.env should set PORT=4000')
  }
}

async function assertApiRoutes() {
  const routes = require('../backend/src/routes')

  for (const apiPath of apiPaths) {
    const url = new URL(`http://localhost${apiPath}`)
    let response = null

    for (const route of routes) {
      response = await route.handleRoute?.({ method: 'GET' }, url, {})
      if (response) {
        break
      }
    }

    if (!response) {
      fail(`${apiPath} has no backend route`)
      continue
    }

    if (response.statusCode >= 400) {
      fail(`${apiPath} returned ${response.statusCode}`)
      continue
    }

    pass(`${apiPath} responds`)
  }
}

async function assertDatabaseConnection() {
  const { getPrisma } = require('../backend/src/prisma/client')
  const prisma = getPrisma()

  if (!prisma) {
    fail('Prisma client is unavailable. Run npm.cmd --prefix backend run db:generate')
    return
  }

  try {
    await prisma.$connect()
    pass('MySQL connection works through Prisma')
  } catch (error) {
    fail(`Prisma cannot connect to MySQL: ${error.message}`)
  } finally {
    await prisma.$disconnect().catch(() => {})
  }
}

async function main() {
  assertRequiredFiles()
  assertBackendEnv()
  await assertApiRoutes()
  await assertDatabaseConnection()

  if (process.exitCode) {
    process.exit(process.exitCode)
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
