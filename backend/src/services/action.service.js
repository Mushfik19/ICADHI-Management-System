const { getPrisma } = require('../prisma/client')

const fallbackActions = []

function normalizeAction(payload = {}) {
  return {
    module: String(payload.module || 'general').trim(),
    action: String(payload.action || payload.title || 'Action').trim(),
    requestedBy: String(payload.requestedBy || 'Guest').trim(),
    status: String(payload.status || 'Recorded').trim(),
    details: JSON.stringify(payload.details || payload),
  }
}

async function recordAction(payload = {}) {
  const prepared = normalizeAction(payload)
  const prisma = getPrisma()

  if (prisma?.actionRecord) {
    try {
      const record = await prisma.actionRecord.create({ data: prepared })
      return {
        success: true,
        message: 'Action recorded in database.',
        data: record,
      }
    } catch {
      // Fall back below so the UI still gets a useful response if the DB is not migrated yet.
    }
  }

  const record = {
    id: fallbackActions.length + 1,
    ...prepared,
    createdAt: new Date().toISOString(),
  }
  fallbackActions.push(record)

  return {
    success: true,
    message: 'Action recorded in backend memory. Run Prisma db:push to persist it in MySQL.',
    data: record,
  }
}

async function listActions() {
  const prisma = getPrisma()

  if (prisma?.actionRecord) {
    try {
      const records = await prisma.actionRecord.findMany({
        orderBy: { createdAt: 'desc' },
        take: 50,
      })
      return {
        success: true,
        message: 'Action records loaded from database.',
        data: records,
      }
    } catch {
      // Fall back below.
    }
  }

  return {
    success: true,
    message: 'Action records loaded from backend memory.',
    data: [...fallbackActions].reverse(),
  }
}

module.exports = { listActions, recordAction }
