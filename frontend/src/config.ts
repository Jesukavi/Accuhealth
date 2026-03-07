// Use the environment variable if available, otherwise fallback to localhost
export const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3001/api').replace(/\/api\/?$/, '') + '/api';
console.log('API_BASE_URL:', API_BASE_URL); // Debug log to verify URL in production

