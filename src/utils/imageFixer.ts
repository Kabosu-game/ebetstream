// ========================================
// HELPER GLOBAL POUR LES IMAGES - DÉFINITIF
// Utilise ce helper partout pour éviter les problèmes d'URLs
// ========================================

import { correctImageUrl } from '@/config/constants';

/**
 * Fonction universelle pour corriger les URLs d'images
 * Utilise cette fonction PARTOUT dans le projet
 */
export const fixImageUrl = (url: string | null | undefined): string => {
  if (!url) return '';
  
  try {
    return correctImageUrl(url);
  } catch (error) {
    console.warn('Error fixing image URL:', error);
    return url;
  }
};

/**
 * Vérifie si une URL d'image est valide
 */
export const isValidImageUrl = (url: string): boolean => {
  return !!url && (url.startsWith('http') || url.startsWith('/'));
};

/**
 * Génère une URL de placeholder si nécessaire
 */
export const getPlaceholderUrl = (name?: string): string => {
  if (name) {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=667eea&color=fff&size=200`;
  }
  return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik0yMCAyNkMxNy4yMzA0IDI2IDE1IDIzLjc2OTYgMTUgMjFDMTUgMTguMjMwNCAxNy4yMzA0IDE2IDIwIDE2QzIyLjc2OTYgMTYgMjUgMTguMjMwNCAyNSAyMUMyNSAyMy43Njk2IDIyLjc2OTYgMjYgMjAgMjZaIiBmaWxsPSIjOTQ5OUI0Ii8+CjxjaXJjbGUgY3g9IjEyIiBjeT0iMTQiIHI9IjIiIGZpbGw9IiM5NDk4QjQiLz4KPGNpcmNsZSBjeD0iMjgiIGN5PSIxNCIgcj0iMiIgZmlsbD0iIzk0OThCNCIvPgo8L3N2Zz4K';
};

export default {
  fixImageUrl,
  isValidImageUrl,
  getPlaceholderUrl
};
