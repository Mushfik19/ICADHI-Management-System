function authMiddleware(request, url) {
  if (url.pathname.startsWith('/api/')) {
    return {
      success: true,
      message: 'Request accepted by auth middleware.',
    }
  }

  return {
    success: false,
    message: 'Invalid request context.',
  }
}

module.exports = { authMiddleware }
