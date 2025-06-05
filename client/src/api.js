import axios from 'axios';
import { getApiBaseUrl } from './utils/apiUtils';

// Create axios instance with base URL configuration
const api = axios.create({
  baseURL: getApiBaseUrl(),
  withCredentials: true, // Important for cookies/sessions
});

export default api; 