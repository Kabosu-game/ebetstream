#!/usr/bin/env node

/**
 * Script de diagnostic pour les images qui ne s'affichent pas
 * Vérifie la configuration, les URLs, la connectivité et les erreurs
 */

import https from 'https';
import http from 'http';
import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Couleurs pour la console
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSection(title) {
  console.log('\n' + '='.repeat(60));
  log(title, 'bright');
  console.log('='.repeat(60));
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

function logError(message) {
  log(`❌ ${message}`, 'red');
}

function logWarning(message) {
  log(`⚠️  ${message}`, 'yellow');
}

function logInfo(message) {
  log(`ℹ️  ${message}`, 'cyan');
}

// Fonction pour tester une URL
function testUrl(url, timeout = 10000) {
  return new Promise((resolve) => {
    const urlObj = new URL(url);
    const client = urlObj.protocol === 'https:' ? https : http;
    
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port || (urlObj.protocol === 'https:' ? 443 : 80),
      path: urlObj.pathname + urlObj.search,
      method: 'HEAD',
      timeout: timeout,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    };

    const req = client.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        resolve({
          success: res.statusCode >= 200 && res.statusCode < 400,
          statusCode: res.statusCode,
          headers: res.headers,
          url: url
        });
      });
    });

    req.on('error', (error) => {
      resolve({
        success: false,
        error: error.message,
        url: url
      });
    });

    req.on('timeout', () => {
      req.destroy();
      resolve({
        success: false,
        error: 'Timeout',
        url: url
      });
    });

    req.end();
  });
}

// Lire la configuration
function readConfig() {
  const configPath = join(__dirname, '..', 'src', 'config', 'api.ts');
  let config = {
    API_BASE_URL: 'https://ebetstream.com/apii/api',
    STORAGE_BASE_URL: 'https://ebetstream.com/apii'
  };

  if (existsSync(configPath)) {
    try {
      const content = readFileSync(configPath, 'utf-8');
      const apiMatch = content.match(/API_BASE_URL.*?=.*?['"]([^'"]+)['"]/);
      const storageMatch = content.match(/STORAGE_BASE_URL.*?=.*?['"]([^'"]+)['"]/);
      
      if (apiMatch) config.API_BASE_URL = apiMatch[1];
      if (storageMatch) config.STORAGE_BASE_URL = storageMatch[1];
    } catch (error) {
      logWarning(`Impossible de lire la config: ${error.message}`);
    }
  }

  return config;
}

// Extraire les URLs d'images du code
function findImageUrls() {
  const imageUrls = new Set();
  const baseUrl = config.API_BASE_URL.replace(/\/api$/, '');
  
  // URLs de test basées sur les patterns trouvés dans le code
  const testUrls = [
    // Storage URLs
    `${config.STORAGE_BASE_URL}/storage/events/test.jpg`,
    `${config.STORAGE_BASE_URL}/storage/streams/thumbnails/test.jpg`,
    `${config.STORAGE_BASE_URL}/storage/certifications/id_cards/test.jpg`,
    
    // API Storage URLs
    `${baseUrl}/api/storage/events/test.jpg`,
    `${baseUrl}/api/storage/streams/thumbnails/test.jpg`,
    
    // Base API
    `${config.API_BASE_URL}/storage/events/test.jpg`,
  ];

  testUrls.forEach(url => imageUrls.add(url));
  
  return Array.from(imageUrls);
}

// Vérifier les variables d'environnement
function checkEnvVars() {
  logSection('1. VÉRIFICATION DES VARIABLES D\'ENVIRONNEMENT');
  
  const envFiles = ['.env', '.env.local', '.env.development', '.env.production'];
  let foundEnv = false;
  
  envFiles.forEach(file => {
    const envPath = join(__dirname, '..', file);
    if (existsSync(envPath)) {
      foundEnv = true;
      logInfo(`Fichier trouvé: ${file}`);
      try {
        const content = readFileSync(envPath, 'utf-8');
        const lines = content.split('\n');
        lines.forEach(line => {
          if (line.includes('VITE_API') || line.includes('VITE_STORAGE')) {
            logInfo(`  ${line.trim()}`);
          }
        });
      } catch (error) {
        logError(`Erreur lecture ${file}: ${error.message}`);
      }
    }
  });
  
  if (!foundEnv) {
    logWarning('Aucun fichier .env trouvé - utilisation des valeurs par défaut');
  }
  
  // Vérifier les variables d'environnement système
  if (process.env.VITE_API_BASE_URL) {
    logInfo(`VITE_API_BASE_URL (système): ${process.env.VITE_API_BASE_URL}`);
  }
  if (process.env.VITE_STORAGE_BASE_URL) {
    logInfo(`VITE_STORAGE_BASE_URL (système): ${process.env.VITE_STORAGE_BASE_URL}`);
  }
}

// Vérifier la configuration
function checkConfig() {
  logSection('2. CONFIGURATION ACTUELLE');
  
  logInfo(`API Base URL: ${config.API_BASE_URL}`);
  logInfo(`Storage Base URL: ${config.STORAGE_BASE_URL}`);
  
  // Vérifier les patterns d'URL
  if (config.API_BASE_URL.includes('localhost') || config.API_BASE_URL.includes('127.0.0.1')) {
    logWarning('L\'API utilise localhost - vérifiez que le serveur backend est démarré');
  }
  
  if (config.STORAGE_BASE_URL.includes('localhost') || config.STORAGE_BASE_URL.includes('127.0.0.1')) {
    logWarning('Le Storage utilise localhost - vérifiez que le serveur backend est démarré');
  }
}

// Tester la connectivité de base
async function testConnectivity() {
  logSection('3. TEST DE CONNECTIVITÉ');
  
  const baseUrls = [
    config.API_BASE_URL.replace(/\/api$/, ''),
    config.STORAGE_BASE_URL
  ];
  
  for (const baseUrl of baseUrls) {
    try {
      const url = new URL(baseUrl);
      logInfo(`Test de ${baseUrl}...`);
      const result = await testUrl(baseUrl);
      
      if (result.success) {
        logSuccess(`${baseUrl} - Accessible (${result.statusCode})`);
      } else {
        logError(`${baseUrl} - Inaccessible`);
        if (result.error) {
          logError(`  Erreur: ${result.error}`);
        } else if (result.statusCode) {
          logError(`  Status: ${result.statusCode}`);
        }
      }
    } catch (error) {
      logError(`${baseUrl} - Erreur: ${error.message}`);
    }
  }
}

// Tester les routes de stockage
async function testStorageRoutes() {
  logSection('4. TEST DES ROUTES DE STOCKAGE');
  
  const baseUrl = config.API_BASE_URL.replace(/\/api$/, '');
  
  const storageRoutes = [
    // Routes API storage
    `${baseUrl}/api/storage/events/test.jpg`,
    `${baseUrl}/api/storage/streams/thumbnails/test.jpg`,
    
    // Routes storage directes
    `${config.STORAGE_BASE_URL}/storage/events/test.jpg`,
    `${config.STORAGE_BASE_URL}/storage/streams/thumbnails/test.jpg`,
    
    // Route API alternative
    `${config.API_BASE_URL}/storage/events/test.jpg`,
  ];
  
  for (const route of storageRoutes) {
    logInfo(`Test: ${route}`);
    const result = await testUrl(route);
    
    if (result.success) {
      logSuccess(`  ✅ Accessible (${result.statusCode})`);
      if (result.headers['content-type']) {
        logInfo(`  Content-Type: ${result.headers['content-type']}`);
      }
    } else {
      if (result.statusCode === 404) {
        logWarning(`  ⚠️  Route existe mais fichier non trouvé (404) - Normal si c'est un test`);
      } else if (result.statusCode === 403) {
        logError(`  ❌ Accès refusé (403) - Problème de permissions`);
      } else if (result.statusCode === 401) {
        logError(`  ❌ Non autorisé (401) - Problème d'authentification`);
      } else if (result.error) {
        logError(`  ❌ Erreur: ${result.error}`);
      } else {
        logError(`  ❌ Status: ${result.statusCode || 'Unknown'}`);
      }
    }
    
    // Vérifier CORS
    if (result.headers) {
      const corsOrigin = result.headers['access-control-allow-origin'];
      if (corsOrigin) {
        logInfo(`  CORS Origin: ${corsOrigin}`);
      } else {
        logWarning(`  ⚠️  Pas de header CORS - peut causer des problèmes en développement`);
      }
    }
  }
}

// Analyser les patterns dans le code
function analyzeCodePatterns() {
  logSection('5. ANALYSE DES PATTERNS DANS LE CODE');
  
  const patterns = [
    {
      name: 'getStorageUrl()',
      description: 'Fonction helper pour construire les URLs de stockage',
      location: 'src/config/api.ts',
      pattern: 'getStorageUrl(path)'
    },
    {
      name: 'API Storage Routes',
      description: 'Routes /api/storage/* pour les images',
      location: 'src/pages/EventDetail.vue',
      pattern: '/api/storage/events/'
    },
    {
      name: 'Direct Storage URLs',
      description: 'URLs directes vers /storage/*',
      location: 'src/components/Pages/Dashboard/Profile.vue',
      pattern: '/storage/'
    }
  ];
  
  patterns.forEach(pattern => {
    logInfo(`${pattern.name}:`);
    logInfo(`  Description: ${pattern.description}`);
    logInfo(`  Localisation: ${pattern.location}`);
    logInfo(`  Pattern: ${pattern.pattern}`);
  });
}

// Recommandations
function showRecommendations() {
  logSection('6. RECOMMANDATIONS');
  
  logInfo('Vérifications à faire:');
  console.log('');
  log('1. Vérifiez que le serveur backend est démarré et accessible', 'yellow');
  log('2. Vérifiez les permissions des fichiers dans storage/', 'yellow');
  log('3. Vérifiez la configuration CORS sur le serveur backend', 'yellow');
  log('4. Vérifiez que les chemins dans la base de données sont corrects', 'yellow');
  log('5. Ouvrez la console du navigateur (F12) pour voir les erreurs d\'images', 'yellow');
  console.log('');
  
  logInfo('Commandes utiles:');
  console.log('');
  log('  - Ouvrir la console navigateur: F12 > Console', 'cyan');
  log('  - Vérifier les requêtes réseau: F12 > Network > Images', 'cyan');
  log('  - Tester une URL d\'image directement dans le navigateur', 'cyan');
  console.log('');
  
  logInfo('URLs de test à vérifier dans le navigateur:');
  console.log('');
  const baseUrl = config.API_BASE_URL.replace(/\/api$/, '');
  log(`  ${config.STORAGE_BASE_URL}/storage/events/[nom-fichier]`, 'cyan');
  log(`  ${baseUrl}/api/storage/events/[nom-fichier]`, 'cyan');
}

// Fonction principale
async function main() {
  log('\n🔍 DIAGNOSTIC DES IMAGES - DÉBUT\n', 'bright');
  
  global.config = readConfig();
  
  checkEnvVars();
  checkConfig();
  await testConnectivity();
  await testStorageRoutes();
  analyzeCodePatterns();
  showRecommendations();
  
  log('\n✨ DIAGNOSTIC TERMINÉ\n', 'bright');
}

// Exécuter
main().catch(error => {
  logError(`Erreur fatale: ${error.message}`);
  console.error(error);
  process.exit(1);
});





