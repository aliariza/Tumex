const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000'

export async function fetchMachines(params = {}) {
  const url = new URL(`${API_BASE_URL}/machines`)

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, value)
    }
  })

  const response = await fetch(url)

  if (!response.ok) {
    throw new Error('Failed to fetch machines')
  }

  return response.json()
}