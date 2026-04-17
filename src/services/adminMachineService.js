import api from '../lib/api'

export function getAdminMachines() {
  return api.get('/admin/machines')
}

export function createAdminMachine(payload) {
  return api.post('/admin/machines', payload)
}

export function updateAdminMachine(id, payload) {
  return api.put(`/admin/machines/${id}`, payload)
}

export function deleteAdminMachine(id) {
  return api.delete(`/admin/machines/${id}`)
}