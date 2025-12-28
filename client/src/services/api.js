import axios from 'axios'

const API_BASE = '/api'

// Create axios instance
const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Add auth token to requests
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Assignment services
export const assignmentService = {
  getAll: async (filters = {}) => {
    const params = new URLSearchParams(filters).toString()
    const response = await api.get(`/assignments${params ? '?' + params : ''}`)
    return response.data
  },

  getById: async (id) => {
    const response = await api.get(`/assignments/${id}`)
    return response.data
  }
}

// Query services
export const queryService = {
  execute: async (query, assignmentId = null) => {
    const response = await api.post('/query/execute', { query, assignmentId })
    return response.data
  },

  getTableSchema: async (tableName) => {
    const response = await api.get(`/query/schema/${tableName}`)
    return response.data
  },

  getSampleData: async (tableName, limit = 5) => {
    const response = await api.get(`/query/sample/${tableName}?limit=${limit}`)
    return response.data
  },

  getHistory: async (assignmentId) => {
    const response = await api.get(`/query/history/${assignmentId}`)
    return response.data
  }
}

// Hint services
export const hintService = {
  getHint: async (assignmentId, userQuery = '', errorMessage = '') => {
    const response = await api.post('/hints', { 
      assignmentId, 
      userQuery, 
      errorMessage 
    })
    return response.data
  }
}

// Auth services
export const authService = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password })
    return response.data
  },

  register: async (name, email, password) => {
    const response = await api.post('/auth/register', { name, email, password })
    return response.data
  },

  getMe: async () => {
    const response = await api.get('/auth/me')
    return response.data
  }
}

export default api
