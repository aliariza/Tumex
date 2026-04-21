import axios from 'axios'
import { clearAuthSession, getSessionToken } from '@/services/authSession'

const baseURL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000').replace(/\/$/, '')

const api = axios.create({
  baseURL
})

api.interceptors.request.use((config) => {
  const token = getSessionToken()

  if (token) {
    config.headers = config.headers || {}
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearAuthSession()
      window.dispatchEvent(new Event('auth:unauthorized'))
    }

    return Promise.reject(error)
  }
)

export default api
