import api from '@/shared/lib/api'

export async function getPublishedJobPositions() {
  const response = await api.get('/job-positions')
  return response.data
}
