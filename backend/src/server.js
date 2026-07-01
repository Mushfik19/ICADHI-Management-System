const http = require('node:http')
const path = require('node:path')
require('dotenv').config({
  path: path.resolve(__dirname, '../.env'),
})

const apiRoutes = require('./routes')

const PORT = Number(process.env.PORT || 4000)
const BODY_METHODS = new Set(['POST', 'PUT', 'PATCH'])

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  })
  response.end(JSON.stringify(payload))
}

function collectBody(request) {
  return new Promise((resolve, reject) => {
    let raw = ''

    request.on('data', (chunk) => {
      raw += chunk
    })

    request.on('end', () => {
      if (!raw) {
        resolve({})
        return
      }

      try {
        resolve(JSON.parse(raw))
      } catch (error) {
        reject(error)
      }
    })

    request.on('error', reject)
  })
}

function analyzePrompt(prompt = '') {
  const normalized = String(prompt || '').trim().toLowerCase()
  const flags = []

  if (/(fever|cough|pain|fatigue|nausea|dizzy|breath|wound)/i.test(normalized)) {
    flags.push('symptom cluster detected')
  }

  if (/(xray|scan|image|radiology|mri)/i.test(normalized)) {
    flags.push('imaging context detected')
  }

  return {
    success: true,
    message: 'AI analysis completed.',
    analysis: {
      summary:
        flags.length > 0
          ? `The note suggests ${flags.join(' and ')}.`
          : 'The note is general and does not expose a clear concern.',
      flags,
      recommendedAction:
        flags.length > 0
          ? 'Please consult a clinician for a follow-up review.'
          : 'Continue routine monitoring and rest.',
      input: String(prompt || '').trim(),
    },
  }
}

const server = http.createServer(async (request, response) => {
  if (request.method === 'OPTIONS') {
    sendJson(response, 204, {})
    return
  }

  const url = new URL(request.url, `http://${request.headers.host || 'localhost'}`)

  if (url.pathname === '/health' && request.method === 'GET') {
    sendJson(response, 200, {
      service: 'icadhi-management-backend',
      status: 'ok',
      timestamp: new Date().toISOString(),
    })
    return
  }

  if (url.pathname === '/api/ai/health' && request.method === 'GET') {
    sendJson(response, 200, {
      service: 'icadhi-management-backend',
      status: 'ready',
      message: 'AI analysis endpoint is available.',
      timestamp: new Date().toISOString(),
    })
    return
  }

  if (url.pathname === '/api/ai/analyze' && request.method === 'POST') {
    try {
      const body = await collectBody(request)
      const prompt = String(body.prompt || body.symptoms || '').trim()

      if (!prompt) {
        sendJson(response, 400, {
          success: false,
          message: 'Please provide a symptom note or prompt.',
        })
        return
      }

      sendJson(response, 200, analyzePrompt(prompt))
    } catch {
      sendJson(response, 400, {
        success: false,
        message: 'Invalid JSON request body.',
      })
    }
    return
  }

  if (url.pathname.startsWith('/api/')) {
    let body = {}

    try {
      if (BODY_METHODS.has(request.method)) {
        body = await collectBody(request)
      }
    } catch {
      sendJson(response, 400, {
        success: false,
        message: 'Invalid JSON request body.',
      })
      return
    }

    for (const route of apiRoutes) {
      if (typeof route.handleRoute !== 'function') {
        continue
      }

      const routeResponse = await route.handleRoute(request, url, body)
      if (routeResponse) {
        sendJson(response, routeResponse.statusCode, routeResponse.payload)
        return
      }
    }
  }

  sendJson(response, 404, {
    success: false,
    message: 'Route not found.',
  })
})

if (require.main === module) {
  server.listen(PORT, () => {
    console.log(`ICADHI backend scaffold listening on http://localhost:${PORT}`)
  })
}

module.exports = { server, analyzePrompt, collectBody, sendJson }
