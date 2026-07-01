const actionService = require('../services/action.service')

async function handleRoute(request, url, body = {}) {
  if (request.method === 'GET' && (url.pathname === '/api/actions' || url.pathname === '/api/action-records')) {
    return {
      statusCode: 200,
      payload: await actionService.listActions(),
    }
  }

  if (request.method === 'POST' && (url.pathname === '/api/actions' || url.pathname === '/api/action-records')) {
    return {
      statusCode: 201,
      payload: await actionService.recordAction(body),
    }
  }

  return null
}

module.exports = { handleRoute }
