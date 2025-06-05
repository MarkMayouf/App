// Utility functions for API and image URLs

// Get the base URL for API calls
export const getApiBaseUrl = () => {
  // If REACT_APP_API_URL is explicitly set, use it
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }
  
  // If in development, use localhost
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:8000/api';
  }
  
  // If in production and no explicit URL set, use relative URL for single-service deployment
  return '/api';
};

// Get the base URL for uploaded images
export const getImageBaseUrl = () => {
  // If REACT_APP_API_URL is explicitly set, use it without /api
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL.replace('/api', '');
  }
  
  // If in development, use localhost
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:8000';
  }
  
  // If in production and no explicit URL set, use relative URL (empty string)
  return '';
};

// Helper function to get full image URL
export const getImageUrl = (imagePath) => {
  if (!imagePath) return '';
  return `${getImageBaseUrl()}/upload/${imagePath}`;
}; 