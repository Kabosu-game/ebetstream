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

const getRequestUrl = (error: any): string => {
  const baseURL = error.config?.baseURL || '';
  const url = error.config?.url || '';
  if (!baseURL) return url;
  if (/^https?:\/\//i.test(url)) return url;
  return `${baseURL.replace(/\/+$/, '')}/${String(url).replace(/^\/+/, '')}`;
};

const getValidationMessage = (errors: Record<string, string[] | string> | undefined): string | null => {
  if (!errors) return null;

  const messages = Object.values(errors)
    .flatMap((value) => Array.isArray(value) ? value : [value])
    .filter(Boolean);

  return messages.length ? messages.join('\n') : null;
};

export const getApiErrorMessage = (error: any): string => {
  const status = error.response?.status;
  const data = error.response?.data;
  const serverMessage = data?.message || data?.error;
  const validationMessage = getValidationMessage(data?.errors);

  if (validationMessage) return validationMessage;
  if (serverMessage) return serverMessage;

  if (error.isTimeout || error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
    return "La requête a pris trop de temps. Vérifiez que l'API locale est démarrée puis réessayez.";
  }

  if (error.isCorsError) {
    return "Le navigateur bloque la requête API. Vérifiez la configuration CORS du backend ou utilisez le proxy local Vite.";
  }

  if (error.isNetworkError || error.code === 'ERR_NETWORK' || error.code === 'ERR_FAILED' || !error.response) {
    const target = getRequestUrl(error);
    const localHint = target.includes('127.0.0.1:8000') || target.includes('localhost:8000') || API_BASE_URL === '/api'
      ? " Assurez-vous que l'API Laravel est lancée sur http://127.0.0.1:8000."
      : '';

    return `Impossible de joindre le serveur API.${localHint}`;
  }

  if (status === 400) return "La demande envoyée à l'API est invalide.";
  if (status === 401) return "Votre session a expiré. Connectez-vous à nouveau.";
  if (status === 403) return "Vous n'avez pas l'autorisation d'effectuer cette action.";
  if (status === 404) return "La ressource demandée est introuvable.";
  if (status === 419) return "La session de sécurité a expiré. Rechargez la page puis réessayez.";
  if (status === 422) return "Certaines informations sont invalides. Vérifiez le formulaire.";
  if (status === 429) return "Trop de requêtes envoyées. Patientez un moment puis réessayez.";
  if (status >= 500) return "Le serveur a rencontré une erreur. Consultez les logs Laravel pour le détail.";

  return error.message || "Une erreur inattendue est survenue.";
};

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
  '/about',
  '/arena',
  '/agents-crypto',
  '/contact',
  '/careers',
  '/help',
  '/faq',
  '/support',
  '/privacy',
  '/terms',
  '/cookies',
];

interface IsPublicPathFunction {
  (path: string): boolean;
}

const isPublicPath: IsPublicPathFunction = (path: string): boolean => {
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
    path.startsWith('/arena/');
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
        message: getApiErrorMessage({ ...error, isTimeout: true }),
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

      return Promise.reject({
        ...error,
        message: getApiErrorMessage({ ...error, isNetworkError: true }),
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
        message: getApiErrorMessage({ ...error, isCorsError: true }),
        isCorsError: true,
      });
    }

    return Promise.reject({
      ...error,
      message: getApiErrorMessage(error),
    });
  }
);

export default apiClient;
