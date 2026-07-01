function handleRoute(request, url) {
  if (request.method === 'GET' && url.pathname === '/api/ai/health') {
    return {
      statusCode: 200,
      payload: {
        success: true,
        message: 'AI routes are active.',
      },
    }
  }

  return null
}

module.exports = { handleRoute }
