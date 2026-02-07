import axios from 'axios';
import { API_BASE_URL, API_TIMEOUT } from '@/config/api';

// Log configuration for debugging
console.log('🔗 Axios Configuration:', {
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  currentOrigin: window.location.origin
});

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: API_TIMEOUT,
  withCredentials: false, // Stateless authentication with Bearer tokens, no cookies needed
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Si c'est un FormData, retirer Content-Type pour laisser le navigateur le définir avec la bonne boundary
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle timeout errors
    if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
      console.error('API Request Timeout:', {
        url: error.config?.url,
        method: error.config?.method,
        baseURL: error.config?.baseURL,
      });
      
      // Don't redirect on timeout, just log and reject
      return Promise.reject({
        ...error,
        message: 'Request timeout. Please check your connection and try again.',
        isTimeout: true,
      });
    }

    // Handle network errors (ERR_NETWORK, ERR_FAILED, etc.)
    if (error.code === 'ERR_NETWORK' || error.code === 'ERR_FAILED' || !error.response) {
      console.error('Network Error:', {
        code: error.code,
        url: error.config?.url,
        method: error.config?.method,
        message: error.message,
        baseURL: error.config?.baseURL,
        fullURL: `${error.config?.baseURL}${error.config?.url}`,
      });
      
      // Provide more specific error message based on error code
      let errorMessage = 'Network error. Please check your internet connection.';
      if (error.code === 'ERR_FAILED') {
        errorMessage = 'Failed to connect to the server. The API may be down or unreachable.';
      } else if (error.code === 'ERR_NETWORK') {
        errorMessage = 'Network error. Please check your internet connection.';
      }
      
      return Promise.reject({
        ...error,
        message: errorMessage,
        isNetworkError: true,
      });
    }

    // Handle 401 Unauthorized - redirect to login only if not on public pages
    if (error.response?.status === 401) {
      const publicPages = [
        '/login', 
        '/create-acount', 
        '/',
        '/forgot-password',
        '/reset-password',
        '/become-organizer',
        '/become-referee',
        '/become-ambassador',
        '/events',
        '/clans',
        '/streams',
        '/challenges',
        '/players',
        '/partners',
        '/ambassadors',
      ];
      const currentPath = window.location.pathname;
      
      // Only redirect if not already on a public page
      if (!publicPages.includes(currentPath) && !currentPath.startsWith('/events/') && !currentPath.startsWith('/clans/') && !currentPath.startsWith('/streams/') && !currentPath.startsWith('/challenges/') && !currentPath.startsWith('/players/') && !currentPath.startsWith('/partners/') && !currentPath.startsWith('/ambassadors/')) {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_role');
        window.location.href = '/login';
      }
    }

    // Handle CORS errors
    if (error.message?.includes('CORS') || error.message?.includes('Access-Control')) {
      console.error('CORS Error:', error.message);
      return Promise.reject({
        ...error,
        message: 'CORS error. Please check API configuration.',
        isCorsError: true,
      });
    }

    return Promise.reject(error);
  }
);

export default apiClient;

