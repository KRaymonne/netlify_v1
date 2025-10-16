import React, { createContext, useContext } from 'react'
import axios from 'axios'

const ApiContext = createContext()

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 30000,
})

// Intercepteur pour ajouter l'userId dans les headers
api.interceptors.request.use((config) => {
  const userId = localStorage.getItem('userId') || 'demo-user-123'
  config.headers['X-User-ID'] = userId
  return config
})

// Intercepteur pour gérer les erreurs
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message)
    return Promise.reject(error)
  }
)

export const ApiProvider = ({ children }) => {
  const apiService = {
    // Poèmes
    getPoems: () => api.get('/poems'),
    getPoem: (id) => api.get(`/poems/${id}`),
    
    // Enregistrements
    uploadRecording: (formData) => api.post('/recordings', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
    getRecordings: (userId) => api.get(`/recordings?userId=${userId}`),
    
    // Transcription et scoring
    transcribe: (formData) => api.post('/transcribe', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
    calculateScore: (data) => api.post('/score', data),
    
    // Export pour enseignant
    exportRecordings: (userId) => api.get(`/recordings/export?userId=${userId}`, {
      responseType: 'blob'
    }),
  }

  return (
    <ApiContext.Provider value={apiService}>
      {children}
    </ApiContext.Provider>
  )
}

export const useApi = () => {
  const context = useContext(ApiContext)
  if (!context) {
    throw new Error('useApi must be used within ApiProvider')
  }
  return context
}