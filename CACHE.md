# Problèmes de cache dans le projet

Ce document explique **pourquoi** un cache persistant peut donner l’impression que les mises à jour ne s’affichent pas, et **comment** y remédier.

---

## 1. D’où vient le cache ?

Plusieurs niveaux peuvent garder une ancienne version :

| Niveau | Où | Effet |
|--------|-----|--------|
| **Page d’entrée (SPA)** | CDN / navigateur | `index.html` en cache → ancien JS/CSS chargés |
| **Assets front (Vite)** | Vercel / navigateur | Fichiers avec hash (`/assets/xxx.js`) : normal de les cacher longtemps ; le souci vient surtout du HTML qui pointe vers eux |
| **API Laravel** | Config, routes, vues, cache applicatif | Anciennes configs, routes ou vues servies après un déploiement |
| **Navigateur** | Cache HTTP / disque | Ressources (HTML, API, images) rechargées depuis le cache |

---

## 2. Ce qui a été mis en place

### Frontend (ebetstream)

- **Vercel** (`vercel.json`)  
  La route qui sert `index.html` (fallback SPA) envoie maintenant :  
  `Cache-Control: no-cache, no-store, must-revalidate`  
  → La page d’entrée n’est plus mise en cache longtemps ; après un déploiement, les utilisateurs récupèrent le nouvel `index.html` et donc les nouveaux JS/CSS.

- **Vite en dev** (`vite.config.ts`)  
  Le serveur de dev envoie des en-têtes pour limiter le cache (`Cache-Control`, `Pragma: no-cache`) afin d’éviter de rester sur une ancienne version en local.

### API (ebetstream_api)

- **Script de vidage**  
  `ebetstream_api/public/clear-cache-web.php` exécute les commandes Laravel :  
  `config:clear`, `cache:clear`, `route:clear`, `view:clear`, `optimize:clear`.  
  À appeler après un déploiement (puis à supprimer ou protéger pour la sécurité).

---

## 3. Que faire quand le cache pose encore problème ?

### Côté utilisateur (navigateur)

- **Rechargement forcé** : `Ctrl+Shift+R` (Windows/Linux) ou `Cmd+Shift+R` (Mac).
- **Vider le cache** : DevTools (F12) → onglet *Application* / *Stockage* → *Vider le cache* ou *Clear site data*.

### Côté déploiement front (Vercel)

- Les changements dans `vercel.json` s’appliquent au prochain déploiement.
- Après déploiement, si besoin : invalidation du cache Vercel (si utilisée) ou attendre l’expiration du cache CDN.

### Côté API Laravel (ebetstream_api)

Après chaque déploiement ou changement de config/routes/vues, vider les caches :

```bash
cd ebetstream_api
php artisan config:clear
php artisan cache:clear
php artisan route:clear
php artisan view:clear
php artisan optimize:clear
```

Ou en une commande :

```bash
php artisan optimize:clear
```

Si vous utilisez le script web (à sécuriser ou supprimer après usage) :

```
https://votre-domaine-api/clear-cache-web.php
```

---

## 4. En résumé

- Le cache **persistait** surtout parce que la **page d’entrée** (`index.html`) pouvait être mise en cache, et côté API les caches Laravel n’étaient pas vidés après déploiement.
- **Corrections** : pas de cache long sur `index.html` (Vercel), headers anti-cache en dev (Vite), et vidage explicite des caches Laravel après déploiement.
- En cas de doute : **rechargement forcé** côté navigateur et **`php artisan optimize:clear`** côté API.
