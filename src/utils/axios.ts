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
  withCredentials: false,
});

// Pages publiques (pas besoin d'être connecté)
const publicPages = [
  '/login',
  '/create-account',
  '/create-acount',
  '/',
  '/forgot-password',
  '/reset-password',
  '/become-organizer',
  '/become-referee',
  '/become-ambassador',
  '/become-agent',
  '/events',
  '/clans',
  '/federations',
  '/streams',
  '/challenges',
  '/championships',
  '/marketplace',
  '/ballon-dor',
  '/players',
  '/partners',
  '/ambassadors',
  '/games',
  '/about',
  '/contact',
  '/careers',
  '/help',
  '/faq',
  '/support',
  '/privacy',
  '/terms',
  '/cookies',
];

const isPublicPath = (path) => {
  return publicPages.includes(path) ||
    path.startsWith('/events/') ||
    path.startsWith('/clans/') ||
    path.startsWith('/federations/') ||
    path.startsWith('/streams/') ||
    path.startsWith('/challenges/') ||
    path.startsWith('/championships/') ||
    path.startsWith('/players/') ||
    path.startsWith('/partners/') ||
    path.startsWith('/ambassadors/') ||
    path.startsWith('/games/');
};

// ─── Request interceptor ───────────────────────────────────────────────────
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Si c'est un FormData, retirer Content-Type pour laisser le navigateur
    // le définir avec la bonne boundary
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response interceptor ──────────────────────────────────────────────────
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // ── Timeout ──────────────────────────────────────────────────────────
    if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
      console.error('API Request Timeout:', {
        url: error.config?.url,
        method: error.config?.method,
        baseURL: error.config?.baseURL,
      });
      return Promise.reject({
        ...error,
        message: 'Request timeout. Please check your connection and try again.',
        isTimeout: true,
      });
    }

    // ── Erreur réseau ─────────────────────────────────────────────────────
    if (error.code === 'ERR_NETWORK' || error.code === 'ERR_FAILED' || !error.response) {
      console.error('Network Error:', {
        code: error.code,
        url: error.config?.url,
        method: error.config?.method,
        message: error.message,
        baseURL: error.config?.baseURL,
        fullURL: `${error.config?.baseURL}${error.config?.url}`,
      });

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

    // ── 401 Unauthorized ──────────────────────────────────────────────────
    if (error.response?.status === 401) {
      const currentPath = window.location.pathname;

      if (isPublicPath(currentPath)) {
        // Sur une page publique : le token est invalide/expiré
        // On le supprime et on relance la requête sans token
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_role');

        const retryConfig = { ...error.config };
        delete retryConfig.headers['Authorization'];

        // Éviter une boucle infinie si la requête sans token retourne aussi 401
        if (retryConfig._retry) {
          return Promise.reject(error);
        }
        retryConfig._retry = true;

        return axios(retryConfig);
      } else {
        // Sur une page privée : rediriger vers login
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_role');
        window.location.href = '/login';
      }
    }

    // ── CORS ──────────────────────────────────────────────────────────────
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