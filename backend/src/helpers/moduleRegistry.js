const path = require('node:path')
const { createController } = require('./resourceFactory')
const { getPrisma } = require('../prisma/client')

const seedData = {
  abstract: [
    { id: 1, title: 'AI-supported diabetic screening', reviewer: 'Dr. Sen', status: 'Accepted' },
    { id: 2, title: 'Remote patient monitoring workflow', reviewer: 'Dr. Karim', status: 'Revision' },
  ],
  accommodation: [
    { id: 1, guest: 'Dr. Araf Rahman', hotel: 'Grand Hall Inn', room: '804', status: 'Checked in' },
    { id: 2, guest: 'Prof. Nila Islam', hotel: 'Lakeside Suites', room: '512', status: 'Arriving' },
  ],
  audit: [
    { id: 1, user: 'Admin', action: 'Logged in', status: 'Success' },
    { id: 2, user: 'Registration Desk', action: 'Checked in participant', status: 'Success' },
  ],
  'ai-analytics': [
    { id: 1, metric: 'Expected check-ins', value: 420, confidence: 'High' },
    { id: 2, metric: 'Lunch demand', value: 360, confidence: 'Medium' },
  ],
  badge: [
    { id: 1, participant: 'Araf Rahman', type: 'Speaker', status: 'Printed' },
    { id: 2, participant: 'Nila Islam', type: 'Participant', status: 'Pending' },
  ],
  certificate: [
    { id: 1, recipient: 'Araf Rahman', type: 'Speaker', status: 'Generated' },
    { id: 2, recipient: 'Nila Islam', type: 'Attendance', status: 'Ready' },
  ],
  finance: [
    { id: 1, label: 'Registration revenue', amount: 150000, status: 'Received' },
    { id: 2, label: 'Venue advance', amount: 65000, status: 'Paid' },
  ],
  food: [
    { id: 1, meal: 'Breakfast', served: 180, remaining: 70, status: 'Open' },
    { id: 2, meal: 'Lunch', served: 240, remaining: 110, status: 'Preparing' },
  ],
  hotel: [
    { id: 1, hotel: 'Grand Hall Inn', rooms: 24, guests: 41, status: 'Confirmed' },
    { id: 2, hotel: 'Lakeside Suites', rooms: 16, guests: 29, status: 'Arriving' },
  ],
  exhibition: [
    { id: 1, booth: 'A1', company: 'HealthTech BD', visitors: 84, status: 'Open' },
    { id: 2, booth: 'B2', company: 'MediCloud', visitors: 57, status: 'Open' },
  ],
  'live-monitor': [
    { id: 1, zone: 'Registration', crowd: 'High', status: 'Staff assigned' },
    { id: 2, zone: 'Food Court', crowd: 'Medium', status: 'Normal' },
  ],
  notification: [
    { id: 1, title: 'Registration opened', channel: 'System', status: 'Sent' },
    { id: 2, title: 'Lunch service starts at 1 PM', channel: 'SMS', status: 'Queued' },
  ],
  medical: [
    { id: 1, patient: 'Araf Rahman', issue: 'Fatigue', severity: 'Low', doctor: 'Medical Desk', status: 'Stable' },
    { id: 2, patient: 'Nila Islam', issue: 'Blood pressure check', severity: 'Medium', doctor: 'Dr. Karim', status: 'Monitoring' },
  ],
  participant: [
    { id: 1, name: 'Araf Rahman', email: 'araf@example.com', country: 'Bangladesh', institution: 'Dhaka Medical College', category: 'Speaker', status: 'Checked in' },
    { id: 2, name: 'Nila Islam', email: 'nila@example.com', country: 'Bangladesh', institution: 'North South University', category: 'Participant', status: 'Registered' },
  ],
  profile: [
    { id: 1, name: 'Mushfik Admin', role: 'admin', status: 'Active' },
    { id: 2, name: 'Registration Desk', role: 'organizer', status: 'Active' },
  ],
  report: [
    { id: 1, title: 'Attendance report', format: 'PDF', status: 'Ready' },
    { id: 2, title: 'Finance report', format: 'Excel', status: 'Draft' },
  ],
  review: [
    { id: 1, paper: 'AI in Rural Health', reviewer: 'Dr. Sen', status: 'In Review' },
    { id: 2, paper: 'Remote ECG Screening', reviewer: 'Dr. Karim', status: 'Accepted' },
  ],
  role: [
    { id: 1, name: 'admin', permissions: 'All modules', status: 'Enabled' },
    { id: 2, name: 'organizer', permissions: 'Operations modules', status: 'Enabled' },
  ],
  scanner: [
    { id: 1, gate: 'Main Entry', scans: 312, status: 'Online' },
    { id: 2, gate: 'Workshop Hall', scans: 86, status: 'Online' },
  ],
  security: [
    { id: 1, incident: 'Lost badge', severity: 'Low', status: 'Resolved' },
    { id: 2, incident: 'Crowd support requested', severity: 'Medium', status: 'Monitoring' },
  ],
  session: [
    { id: 1, title: 'Opening Keynote', hall: 'Hall A', status: 'Scheduled' },
    { id: 2, title: 'Digital Health Panel', hall: 'Hall B', status: 'Live' },
  ],
  settings: [
    { id: 1, key: 'congressName', value: 'ICADHI 2026' },
    { id: 2, key: 'timezone', value: 'Asia/Dhaka' },
  ],
  speaker: [
    { id: 1, name: 'Dr. Araf Rahman', topic: 'AI Diagnostics', status: 'Confirmed' },
    { id: 2, name: 'Prof. Nila Islam', topic: 'Telemedicine', status: 'Confirmed' },
  ],
  sponsor: [
    { id: 1, company: 'HealthTech BD', tier: 'Gold', status: 'Active' },
    { id: 2, company: 'MediCloud', tier: 'Silver', status: 'Active' },
  ],
  transport: [
    { id: 1, vehicle: 'Microbus 01', driver: 'Hasan', status: 'Airport pickup' },
    { id: 2, vehicle: 'Sedan 03', driver: 'Rafiq', status: 'Available' },
  ],
  venue: [
    { id: 1, area: 'Hall A', route: 'Main lobby to east wing', status: 'Open' },
    { id: 2, area: 'Medical Desk', route: 'Lobby left corridor', status: 'Open' },
  ],
  volunteer: [
    { id: 1, name: 'Rafi', shift: 'Morning', status: 'Assigned' },
    { id: 2, name: 'Sadia', shift: 'Afternoon', status: 'Checked in' },
  ],
  workshop: [
    { id: 1, title: 'Hands-on ECG AI', capacity: 40, status: 'Open' },
    { id: 2, title: 'X-ray Model Review', capacity: 30, status: 'Full' },
  ],
}

const controllers = new Map()

function inferName(filename = '') {
  return path.basename(filename).split('.')[0]
}

function pluralize(name) {
  if (name.endsWith('y')) {
    return `${name.slice(0, -1)}ies`
  }

  if (name.endsWith('s')) {
    return name
  }

  return `${name}s`
}

function toTitle(name) {
  return name
    .split(/[-_\s]/)
    .filter(Boolean)
    .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
    .join(' ')
}

function getController(resourceName) {
  if (!controllers.has(resourceName)) {
    controllers.set(
      resourceName,
      createController(resourceName, seedData[resourceName] || []),
    )
  }

  return controllers.get(resourceName)
}

function parseModuleRecord(record) {
  try {
    return {
      id: `DB-${record.id}`,
      ...JSON.parse(record.payload || '{}'),
      savedAt: record.createdAt,
    }
  } catch {
    return {
      id: `DB-${record.id}`,
      resource: record.resource,
      payload: record.payload,
      savedAt: record.createdAt,
    }
  }
}

async function listPersistedRecords(resourceName) {
  if (process.env.NODE_ENV === 'test') {
    return []
  }

  const prisma = getPrisma()

  if (!prisma?.moduleRecord) {
    return []
  }

  try {
    const records = await prisma.moduleRecord.findMany({
      where: { resource: resourceName },
      orderBy: { createdAt: 'desc' },
      take: 50,
    })
    return records.map(parseModuleRecord)
  } catch {
    return []
  }
}

async function createPersistedRecord(resourceName, payload = {}) {
  if (process.env.NODE_ENV === 'test') {
    return null
  }

  const prisma = getPrisma()

  if (!prisma?.moduleRecord) {
    return null
  }

  try {
    const record = await prisma.moduleRecord.create({
      data: {
        resource: resourceName,
        payload: JSON.stringify(payload),
      },
    })
    return parseModuleRecord(record)
  } catch {
    return null
  }
}

function createNamedController(filename) {
  return getController(inferName(filename))
}

function statusFor(result, successStatus = 200) {
  return result?.success === false ? 404 : successStatus
}

function createResourceRoute(resourceName, controller = getController(resourceName)) {
  const basePaths = new Set([`/api/${resourceName}`, `/api/${pluralize(resourceName)}`])

  function parsePath(pathname) {
    for (const basePath of basePaths) {
      if (pathname === basePath) {
        return { matches: true, id: null }
      }

      if (pathname.startsWith(`${basePath}/`)) {
        const id = decodeURIComponent(pathname.slice(basePath.length + 1))
        return id && !id.includes('/') ? { matches: true, id } : { matches: false }
      }
    }

    return { matches: false }
  }

  async function handleRoute(request, url, body = {}) {
    const pathMatch = parsePath(url.pathname)
    if (!pathMatch.matches) {
      return null
    }

    if (request.method === 'GET' && !pathMatch.id) {
      const persistedRecords = await listPersistedRecords(resourceName)
      const payload = controller.list()
      return {
        statusCode: 200,
        payload: {
          ...payload,
          data: [...persistedRecords, ...payload.data],
        },
      }
    }

    if (request.method === 'GET' && pathMatch.id) {
      const payload = controller.get(pathMatch.id)
      return { statusCode: statusFor(payload), payload }
    }

    if (request.method === 'POST' && !pathMatch.id) {
      const persistedRecord = await createPersistedRecord(resourceName, body)

      if (persistedRecord) {
        return {
          statusCode: 201,
          payload: {
            success: true,
            message: `${resourceName} created and saved successfully.`,
            data: persistedRecord,
          },
        }
      }

      return { statusCode: 201, payload: controller.create(body) }
    }

    if ((request.method === 'PUT' || request.method === 'PATCH') && pathMatch.id) {
      const payload = controller.update(pathMatch.id, body)
      return { statusCode: statusFor(payload), payload }
    }

    if (request.method === 'DELETE' && pathMatch.id) {
      const payload = controller.remove(pathMatch.id)
      return { statusCode: statusFor(payload), payload }
    }

    return {
      statusCode: 405,
      payload: {
        success: false,
        message: `${toTitle(resourceName)} route does not support ${request.method}.`,
      },
    }
  }

  return { resourceName, basePaths: [...basePaths], handleRoute }
}

function createNamedRoute(filename) {
  const resourceName = inferName(filename)
  return createResourceRoute(resourceName)
}

function createNamedService(filename) {
  const resourceName = inferName(filename)
  const controller = getController(resourceName)

  return {
    serviceName: resourceName,
    health() {
      return {
        success: true,
        message: `${toTitle(resourceName)} service is ready.`,
      }
    },
    list: controller.list,
    get: controller.get,
    create: controller.create,
    update: controller.update,
    remove: controller.remove,
  }
}

function createNamedSocket(filename) {
  const resourceName = inferName(filename)
  const eventPrefix = resourceName.replace(/-/g, ':')
  const events = {
    subscribe: `${eventPrefix}:subscribe`,
    update: `${eventPrefix}:update`,
    broadcast: `${eventPrefix}:broadcast`,
  }

  function register(io) {
    if (!io || typeof io.on !== 'function') {
      return {
        success: false,
        message: `${toTitle(resourceName)} socket registration requires an io server.`,
        events,
      }
    }

    io.on('connection', (socket) => {
      socket.emit?.(events.update, {
        success: true,
        message: `${toTitle(resourceName)} socket connected.`,
      })

      socket.on?.(events.subscribe, () => {
        socket.emit?.(events.update, {
          success: true,
          message: `${toTitle(resourceName)} socket subscribed.`,
        })
      })
    })

    return {
      success: true,
      message: `${toTitle(resourceName)} socket registered.`,
      events,
    }
  }

  function broadcast(io, payload = {}) {
    io?.emit?.(events.broadcast, {
      resource: resourceName,
      ...payload,
    })
  }

  return { resourceName, events, register, broadcast }
}

module.exports = {
  createNamedController,
  createNamedRoute,
  createNamedService,
  createNamedSocket,
  createResourceRoute,
  getController,
}
