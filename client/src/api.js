import axios from 'axios';

// Create axios instance with base URL configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000/api',
  withCredentials: true, // Important for cookies/sessions
});

export default api; 