import api from '../lib/api'

export function getAdminUsers() {
  return api.get('/admin/users')
}

export function updateAdminUserRole(id, role) {
  return api.patch(`/admin/users/${id}/role`, { role })
}
