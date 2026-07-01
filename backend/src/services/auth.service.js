const { getPrisma } = require('../prisma/client')

const fallbackOrganizers = []

const adminEmail = () => String(process.env.ADMIN_EMAIL || 'mushfik.cse@gmail.com').trim().toLowerCase()
const adminPassword = () => String(process.env.ADMIN_PASSWORD || process.env.VITE_DEMO_ADMIN_PASSWORD || '1324')

function publicOrganizer(user) {
  return {
    id: user.id,
    name: user.fullName || user.name || '',
    institution: user.institution || '',
    phone: user.phone || '',
    email: user.email || '',
    status: user.status || 'pending',
    role: 'organizer',
  }
}

async function ensureRole(name) {
  const prisma = getPrisma()
  if (!prisma?.role) {
    return null
  }

  return prisma.role.upsert({
    where: { name },
    update: {},
    create: { name },
  })
}

async function listOrganizers() {
  const prisma = getPrisma()

  if (prisma?.user) {
    try {
      const role = await ensureRole('organizer')
      const users = await prisma.user.findMany({
        where: role ? { roleId: role.id } : { role: { name: 'organizer' } },
        orderBy: { createdAt: 'desc' },
      })

      return {
        success: true,
        message: 'Organizers loaded from database.',
        data: users.map(publicOrganizer),
      }
    } catch {
      // Use memory fallback while Prisma/MySQL is being prepared.
    }
  }

  return {
    success: true,
    message: 'Organizers loaded from backend memory.',
    data: fallbackOrganizers.map(publicOrganizer),
  }
}

async function signup(payload = {}) {
  const fullName = String(payload.name || payload.fullName || '').trim()
  const institution = String(payload.institution || '').trim()
  const phone = String(payload.phone || '').trim()
  const email = String(payload.email || '').trim().toLowerCase()
  const password = String(payload.password || '')

  if (!fullName || !email || !password) {
    return {
      success: false,
      message: 'Name, email, and password are required.',
    }
  }

  const prisma = getPrisma()

  if (prisma?.user) {
    try {
      const role = await ensureRole('organizer')
      const existing = await prisma.user.findUnique({ where: { email } })

      if (existing) {
        return {
          success: false,
          message: 'This organizer email already exists in the database.',
        }
      }

      const organizer = await prisma.user.create({
        data: {
          fullName,
          institution,
          phone,
          email,
          passwordHash: password,
          status: 'pending',
          roleId: role.id,
        },
      })

      return {
        success: true,
        message: 'Organizer signup saved in MySQL. Admin approval is required before login.',
        organizer: publicOrganizer(organizer),
      }
    } catch {
      // Use memory fallback while schema/client is being prepared.
    }
  }

  if (fallbackOrganizers.some((organizer) => organizer.email === email)) {
    return {
      success: false,
      message: 'This organizer email already exists.',
    }
  }

  const organizer = {
    id: Date.now(),
    fullName,
    institution,
    phone,
    email,
    passwordHash: password,
    status: 'pending',
  }
  fallbackOrganizers.push(organizer)

  return {
    success: true,
    message: 'Organizer signup saved in backend memory. Run Prisma db:push for MySQL persistence.',
    organizer: publicOrganizer(organizer),
  }
}

async function login(payload = {}) {
  const email = String(payload.email || '').trim().toLowerCase()
  const password = String(payload.password || '')

  if (email === adminEmail() && password === adminPassword()) {
    return {
      success: true,
      message: 'Admin login successful.',
      user: {
        name: 'Mushfik Admin',
        email,
        role: 'admin',
      },
    }
  }

  const prisma = getPrisma()

  if (prisma?.user) {
    try {
      const user = await prisma.user.findUnique({
        where: { email },
        include: { role: true },
      })

      if (!user || user.passwordHash !== password || user.role?.name !== 'organizer') {
        return {
          success: false,
          message: 'Organizer login failed. Please verify email and password.',
        }
      }

      if (user.status !== 'approved') {
        return {
          success: false,
          message: 'Organizer account is pending admin approval.',
        }
      }

      return {
        success: true,
        message: 'Organizer login successful.',
        user: {
          name: user.fullName,
          email: user.email,
          role: 'organizer',
        },
      }
    } catch {
      // Use memory fallback while Prisma/MySQL is being prepared.
    }
  }

  const organizer = fallbackOrganizers.find(
    (item) => item.email === email && item.passwordHash === password,
  )

  if (!organizer) {
    return {
      success: false,
      message: 'Organizer login failed. Please verify email and password.',
    }
  }

  if (organizer.status !== 'approved') {
    return {
      success: false,
      message: 'Organizer account is pending admin approval.',
    }
  }

  return {
    success: true,
    message: 'Organizer login successful.',
    user: {
      name: organizer.fullName,
      email: organizer.email,
      role: 'organizer',
    },
  }
}

async function approveOrganizer(id) {
  const normalizedId = Number(id)
  const prisma = getPrisma()

  if (prisma?.user && Number.isFinite(normalizedId)) {
    try {
      const organizer = await prisma.user.update({
        where: { id: normalizedId },
        data: { status: 'approved' },
      })

      return {
        success: true,
        message: 'Organizer approved and saved in database.',
        organizer: publicOrganizer(organizer),
      }
    } catch {
      // Use memory fallback below.
    }
  }

  const organizer = fallbackOrganizers.find((item) => Number(item.id) === normalizedId)
  if (!organizer) {
    return {
      success: false,
      message: 'Organizer not found.',
    }
  }

  organizer.status = 'approved'
  return {
    success: true,
    message: 'Organizer approved in backend memory.',
    organizer: publicOrganizer(organizer),
  }
}

module.exports = {
  approveOrganizer,
  listOrganizers,
  login,
  signup,
}
