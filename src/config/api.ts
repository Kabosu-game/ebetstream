// ========================================
// CONFIGURATION API - UTILISE LA CONSTANTE UNIQUE
// ========================================
import { API_BASE_URL, API_TIMEOUT, getApiUrl, getStorageUrl, correctImageUrl, STORAGE_BASE_URL, PRODUCTION_URLS } from './constants';

// Export pour compatibilité avec le code existant
export { API_BASE_URL, API_TIMEOUT, getApiUrl, getStorageUrl, correctImageUrl, STORAGE_BASE_URL, PRODUCTION_URLS };

// Alias pour compatibilité
export const API_CONFIG = {
  BASE_URL: API_BASE_URL
};

console.log('API_BASE_URL:', API_BASE_URL);

