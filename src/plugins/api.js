import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8081', // Replace with your API URL
  timeout: 1000,
})
// Request interceptor to add the API key to the headers
api.interceptors.request.use(
  (config) => {
    const apiKey = localStorage.getItem('token')
     // Retrieve the API key (stored as token) from localStorage
    if (apiKey) {
      config.headers.Authorization = apiKey  
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

export default api