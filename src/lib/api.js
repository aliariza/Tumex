import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000'
})

// Inject auth token on every request
api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Centralised response error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid — clear session and let the component handle redirect
      sessionStorage.removeItem('isAuthenticated')
      sessionStorage.removeItem('token')
    }
    return Promise.reject(error)
  }
)

export default api
