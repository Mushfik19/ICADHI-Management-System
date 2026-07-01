const authService = require('../services/auth.service')

async function handleRoute(request, url, body = {}) {
  if (request.method === 'POST' && url.pathname === '/api/auth/login') {
    const email = String(body.email || '').trim().toLowerCase()
    const password = String(body.password || '')

    if (!email || !password) {
      return {
        statusCode: 400,
        payload: {
          success: false,
          message: 'Email and password are required.',
        },
      }
    }

    const result = await authService.login({ email, password })
    return {
      statusCode: result.success ? 200 : 401,
      payload: result,
    }
  }

  if (request.method === 'POST' && url.pathname === '/api/auth/signup') {
    const fullName = String(body.name || '').trim()
    const email = String(body.email || '').trim().toLowerCase()
    const password = String(body.password || '')

    if (!fullName || !email || !password) {
      return {
        statusCode: 400,
        payload: {
          success: false,
          message: 'Name, email, and password are required.',
        },
      }
    }

    const result = await authService.signup({ ...body, name: fullName, email, password })
    return {
      statusCode: result.success ? 201 : 409,
      payload: result,
    }
  }

  if (request.method === 'GET' && (url.pathname === '/api/organizers' || url.pathname === '/api/auth/organizers')) {
    return {
      statusCode: 200,
      payload: await authService.listOrganizers(),
    }
  }

  const approveMatch = url.pathname.match(/^\/api\/organizers\/([^/]+)\/approve$/)
  if ((request.method === 'PATCH' || request.method === 'POST') && approveMatch) {
    const result = await authService.approveOrganizer(approveMatch[1])
    return {
      statusCode: result.success ? 200 : 404,
      payload: result,
    }
  }

  return null
}

module.exports = { handleRoute }
