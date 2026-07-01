const test = require('node:test')
const assert = require('node:assert/strict')

process.env.NODE_ENV = 'test'

const actionRoutes = require('../routes/action.routes')
const authRoutes = require('../routes/auth.routes')
const apiRoutes = require('../routes')
const foodRoutes = require('../routes/food.routes')
const participantRoutes = require('../routes/participant.routes')
const medicalRoutes = require('../routes/medical.routes')

test('auth routes expose a working request handler', () => {
  assert.equal(typeof authRoutes.handleRoute, 'function')
})

test('auth routes expose organizer list handler', async () => {
  const response = await authRoutes.handleRoute(
    { method: 'GET' },
    new URL('http://localhost/api/organizers'),
  )

  assert.equal(response.statusCode, 200)
  assert.equal(response.payload.success, true)
  assert.ok(Array.isArray(response.payload.data))
})

test('action routes record frontend actions', async () => {
  const response = await actionRoutes.handleRoute(
    { method: 'POST' },
    new URL('http://localhost/api/actions'),
    { module: 'participants', action: 'Add Participant', requestedBy: 'Test User' },
  )

  assert.equal(response.statusCode, 201)
  assert.equal(response.payload.success, true)
  assert.equal(response.payload.data.module, 'participants')
})

test('participant routes expose a working request handler', () => {
  assert.equal(typeof participantRoutes.handleRoute, 'function')
})

test('medical routes expose a working request handler', () => {
  assert.equal(typeof medicalRoutes.handleRoute, 'function')
})

test('route registry exposes working resource handlers', () => {
  assert.ok(apiRoutes.length >= 20)
  assert.ok(apiRoutes.every((route) => typeof route.handleRoute === 'function'))
})

test('food routes support list and create requests', async () => {
  const listResponse = await foodRoutes.handleRoute(
    { method: 'GET' },
    new URL('http://localhost/api/food'),
  )

  assert.equal(listResponse.statusCode, 200)
  assert.equal(listResponse.payload.success, true)
  assert.ok(Array.isArray(listResponse.payload.data))

  const createResponse = await foodRoutes.handleRoute(
    { method: 'POST' },
    new URL('http://localhost/api/food'),
    { meal: 'Dinner', served: 0, remaining: 200, status: 'Scheduled' },
  )

  assert.equal(createResponse.statusCode, 201)
  assert.equal(createResponse.payload.success, true)
  assert.equal(createResponse.payload.data.meal, 'Dinner')
})
