// Image URL Helper - Utilise la constante unique de l'API
import { correctImageUrl } from '@/config/constants';

/**
 * Corrige les URLs d'images - utilise la fonction centralisée
 * @param url L'URL originale de l'image
 * @returns L'URL corrigée
 */
export const correctImage = (url: string): string => {
  return correctImageUrl(url);
};

// Export par défaut avec l'alias correct
export default {
  correctImage
};
