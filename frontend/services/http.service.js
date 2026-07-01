const API_BASE_URL = import.meta.env?.VITE_API_BASE_URL || ''

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  })

  const contentType = response.headers.get('content-type') || ''
  const payload = contentType.includes('application/json')
    ? await response.json()
    : await response.text()

  if (!response.ok) {
    throw new Error(payload?.message || 'Request failed')
  }

  return payload
}

export async function httpGet(path) {
  return request(path, { method: 'GET' })
}

export async function httpPost(path, body) {
  return request(path, {
    method: 'POST',
    body: JSON.stringify(body ?? {}),
  })
}