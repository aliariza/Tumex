import api from '@/shared/lib/api'

export async function fetchMachines(params = {}) {
  const response = await api.get('/machines', { params })
  return response.data
}

export async function fetchMachineById(id) {
  const response = await api.get(`/machines/${id}`)
  return response.data
}

export async function fetchMachineByModel(model) {
  const response = await api.get(`/machines/model/${encodeURIComponent(model)}`)
  return response.data
}