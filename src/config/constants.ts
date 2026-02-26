// ========================================
// CONFIGURATION UNIQUE - DÉFINITIVE
// UNE SEULE CONSTANTE À MODIFIER POUR TOUT CHANGER
// ========================================

// API de production - utilisée quand aucune URL n'est forcée via .env
export const PRODUCTION_API_URL = 'https://acmpt.online/api';
export const PRODUCTION_BASE_URL = 'https://acmpt.online';

// Priorité au .env : si VITE_API_BASE_URL est défini, on l'utilise (même en dev → afficher les données acmpt.online)
const envApiUrl = import.meta.env.VITE_API_BASE_URL as string | undefined;
const envStorageUrl = import.meta.env.VITE_STORAGE_BASE_URL as string | undefined;

const isDevHost = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
const isDevelopment = import.meta.env.DEV || isDevHost;

// URL UNIQUE de l'API : .env > sinon en dev = proxy local (/api), en prod = acmpt.online
export const API_BASE_URL = envApiUrl && envApiUrl.trim() !== ''
  ? envApiUrl.replace(/\/+$/, '')
  : (isDevelopment ? '/api' : PRODUCTION_API_URL);

// Base pour storage (images, etc.) : .env > sinon cohérent avec l'API
const storageFromApi = API_BASE_URL.startsWith('http') ? API_BASE_URL.replace(/\/api\/?$/, '') : '';
export const API_URL = envStorageUrl && envStorageUrl.trim() !== ''
  ? envStorageUrl.replace(/\/+$/, '')
  : (envApiUrl ? storageFromApi : (isDevelopment ? '' : PRODUCTION_BASE_URL));
export const STORAGE_BASE_URL = envStorageUrl && envStorageUrl.trim() !== ''
  ? envStorageUrl.replace(/\/+$/, '')
  : (API_BASE_URL.startsWith('http') ? API_BASE_URL.replace(/\/api\/?$/, '') : (isDevelopment ? '/api' : PRODUCTION_BASE_URL));
export const API_TIMEOUT = 60000;

// Helper pour obtenir les URLs complètes
export const getApiUrl = (endpoint: string): string => {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  return `${API_BASE_URL}/${cleanEndpoint}`;
};

export const getStorageUrl = (path: string): string => {
  if (!path) return '';
  
  // Si c'est déjà une URL complète, la retourner
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  
  // Nettoyer le chemin
  const cleanPath = path.replace(/^\/+/, '');
  return `${STORAGE_BASE_URL}/api/storage/${cleanPath}`;
};

// Helper universel pour corriger les URLs d'images
export const correctImageUrl = (url: string): string => {
  if (!url) return '';
  
  // Si c'est déjà une URL complète
  if (url.startsWith('http://') || url.startsWith('https://')) {
    // Remplacer toutes les URLs localhost/127.0.0.1 par notre URL unique
    url = url.replace(/https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?\//g, `${API_URL}/`);
    
    // Si l'URL contient déjà /api/storage/, la laisser telle quelle
    if (url.includes('/api/storage/')) {
      return url;
    }
    
    // S'assurer que l'URL utilise /api/storage/
    if (url.includes('/storage/') && !url.includes('/api/storage/')) {
      url = url.replace(/(https?:\/\/[^\/]+)\/storage\//g, `$1/api/storage/`);
    }
    
    return url;
  }
  
  // Si c'est un chemin relatif, utiliser getStorageUrl
  return getStorageUrl(url);
};

// URLs de production pour compatibilité
export const PRODUCTION_URLS = {
  API: PRODUCTION_API_URL,
  STORAGE: PRODUCTION_BASE_URL,
  BASE: PRODUCTION_BASE_URL
};

// Export par défaut pour compatibilité
export default {
  API_URL,
  API_BASE_URL,
  STORAGE_BASE_URL,
  getApiUrl,
  getStorageUrl,
  correctImageUrl,
  PRODUCTION_URLS
};
