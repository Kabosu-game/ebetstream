// ========================================
// CONFIGURATION UNIQUE - DÉFINITIVE
// UNE SEULE CONSTANTE À MODIFIER POUR TOUT CHANGER
// ========================================

// Détection automatique de l'environnement
const isDevelopment = import.meta.env.DEV || import.meta.env.MODE === 'development' || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

// URL UNIQUE de l'API - MODIFIER ICI SEULEMENT
// En développement: utilise le proxy Vite (/api) → http://localhost:8000/api (API Laravel locale)
// En production: utilise https://acmpt.online/api
export const API_URL = isDevelopment ? '' : 'https://acmpt.online';
export const API_BASE_URL = isDevelopment ? '/api' : 'https://acmpt.online/api';

// URLs automatiquement dérivées (NE PAS MODIFIER)
// En dev: /api → proxy vers localhost:8000
export const STORAGE_BASE_URL = isDevelopment ? '/api' : 'https://acmpt.online';
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
  API: 'https://acmpt.online/api',
  STORAGE: 'https://acmpt.online',
  BASE: 'https://acmpt.online'
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
