import axios from 'axios'

const apiBaseUrl = import.meta.env.VITE_API_URL || 'https://qr-testing-qgk0.onrender.com'

const api = axios.create({
  baseURL: apiBaseUrl
})

export default api