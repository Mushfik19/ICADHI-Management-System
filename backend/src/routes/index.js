const { createResourceRoute } = require('../helpers/moduleRegistry')

const routeNames = [
  'auth',
  'action',
  'ai',
  'audit',
  'badge',
  'certificate',
  'dashboard',
  'finance',
  'food',
  'hotel',
  'medical',
  'notification',
  'participant',
  'report',
  'review',
  'scanner',
  'security',
  'session',
  'settings',
  'speaker',
  'sponsor',
  'transport',
  'workshop',
]

const extraRouteNames = [
  'abstract',
  'accommodation',
  'ai-analytics',
  'exhibition',
  'live-monitor',
  'profile',
  'role',
  'venue',
  'volunteer',
]

module.exports = [
  ...routeNames.map((name) => require(`./${name}.routes`)),
  ...extraRouteNames.map((name) => createResourceRoute(name)),
]
