import api from '@/shared/lib/api'

export function getAdminJobPositions() {
  return api.get('/admin/job-positions')
}

export function createAdminJobPosition(payload) {
  return api.post('/admin/job-positions', payload)
}

export function updateAdminJobPosition(id, payload) {
  return api.put(`/admin/job-positions/${id}`, payload)
}

export function deleteAdminJobPosition(id) {
  return api.delete(`/admin/job-positions/${id}`)
}
