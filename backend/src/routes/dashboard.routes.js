function handleRoute(request, url) {
  if (request.method === 'GET' && url.pathname === '/api/dashboard') {
    return {
      statusCode: 200,
      payload: {
        success: true,
        message: 'Dashboard route is active.',
        cards: ['Participants', 'Sessions', 'Medical', 'Reports'],
      },
    }
  }

  return null
}

module.exports = { handleRoute }
