const API_BASE = import.meta.env.VITE_API_BASE_URL || ''

export async function apiFetch(path, options = {}) {
  const url = `${API_BASE}${path}`
  const resp = await fetch(url, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  })
  const isJson = resp.headers.get('content-type')?.includes('application/json')
  const data = isJson ? await resp.json() : null
  if (!resp.ok) {
    const err = new Error('Request failed')
    err.status = resp.status
    err.body = data
    throw err
  }
  return data
}

