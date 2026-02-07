# 📦 Collection Postman - API Ebetstream

## 🚀 Importation dans Postman

1. Ouvrez Postman
2. Cliquez sur **Import**
3. Choisissez **Raw text**
4. Copiez-collez le JSON ci-dessous
5. Cliquez sur **Continue** puis **Import**

## 📋 Collection JSON

```json
{
  "info": {
    "_postman_id": "ebetstream-api-collection",
    "name": "Ebetstream API - Collection Postman",
    "description": "Collection complète pour tester l'API Ebetstream - Inscription, Authentification et fonctionnalités principales",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "🔐 AUTHENTIFICATION",
      "item": [
        {
          "name": "1️⃣ Inscription Utilisateur",
          "event": [
            {
              "listen": "test",
              "script": {
                "exec": [
                  "// Tests pour l'inscription",
                  "pm.test(\"Status code is 200\", function () {",
                  "    pm.response.to.have.status(200);",
                  "});",
                  "",
                  "pm.test(\"Response has success field\", function () {",
                  "    const jsonData = pm.response.json();",
                  "    pm.expect(jsonData).to.have.property('success');",
                  "});",
                  "",
                  "pm.test(\"User registered successfully\", function () {",
                  "    const jsonData = pm.response.json();",
                  "    pm.expect(jsonData.success).to.be.true;",
                  "    pm.expect(jsonData).to.have.property('user');",
                  "    pm.expect(jsonData).to.have.property('token');",
                  "});",
                  "",
                  "// Sauvegarder le token pour les requêtes suivantes",
                  "if (pm.response.code === 200) {",
                  "    const jsonData = pm.response.json();",
                  "    pm.collectionVariables.set('auth_token', jsonData.token);",
                  "    pm.collectionVariables.set('user_id', jsonData.user.id);",
                  "    pm.collectionVariables.set('username', jsonData.user.username);",
                  "    console.log('Token sauvegardé:', jsonData.token);",
                  "}"
                ],
                "type": "text/javascript"
              }
            }
          ],
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json",
                "type": "text"
              },
              {
                "key": "Accept",
                "value": "application/json",
                "type": "text"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n    \"username\": \"testuser_{{$randomInt}}\",\n    \"email\": \"testuser_{{$randomInt}}@example.com\",\n    \"password\": \"password123\",\n    \"password_confirmation\": \"password123\",\n    \"promo_code\": \"\"\n}",
              "options": {
                "raw": {
                  "language": "json"
                }
              }
            },
            "url": {
              "raw": "{{base_url}}/api/register",
              "host": ["{{base_url}}"],
              "path": ["api", "register"]
            }
          }
        },
        {
          "name": "2️⃣ Connexion Utilisateur",
          "event": [
            {
              "listen": "test",
              "script": {
                "exec": [
                  "// Tests pour la connexion",
                  "pm.test(\"Status code is 200\", function () {",
                  "    pm.response.to.have.status(200);",
                  "});",
                  "",
                  "pm.test(\"Login successful\", function () {",
                  "    const jsonData = pm.response.json();",
                  "    pm.expect(jsonData.success).to.be.true;",
                  "    pm.expect(jsonData).to.have.property('token');",
                  "    pm.expect(jsonData).to.have.property('user');",
                  "});",
                  "",
                  "// Sauvegarder le token",
                  "if (pm.response.code === 200) {",
                  "    const jsonData = pm.response.json();",
                  "    pm.collectionVariables.set('auth_token', jsonData.token);",
                  "    pm.collectionVariables.set('user_id', jsonData.user.id);",
                  "    pm.collectionVariables.set('username', jsonData.user.username);",
                  "    console.log('Nouveau token sauvegardé:', jsonData.token);",
                  "}"
                ],
                "type": "text/javascript"
              }
            }
          ],
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json",
                "type": "text"
              },
              {
                "key": "Accept",
                "value": "application/json",
                "type": "text"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n    \"email\": \"testuser@example.com\",\n    \"password\": \"password123\"\n}",
              "options": {
                "raw": {
                  "language": "json"
                }
              }
            },
            "url": {
              "raw": "{{base_url}}/api/login",
              "host": ["{{base_url}}"],
              "path": ["api", "login"]
            }
          }
        },
        {
          "name": "3️⃣ Déconnexion",
          "event": [
            {
              "listen": "test",
              "script": {
                "exec": [
                  "pm.test(\"Status code is 200\", function () {",
                  "    pm.response.to.have.status(200);",
                  "});",
                  "",
                  "pm.test(\"Logout successful\", function () {",
                  "    const jsonData = pm.response.json();",
                  "    pm.expect(jsonData.success).to.be.true;",
                  "});"
                ],
                "type": "text/javascript"
              }
            }
          ],
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json",
                "type": "text"
              },
              {
                "key": "Accept",
                "value": "application/json",
                "type": "text"
              },
              {
                "key": "Authorization",
                "value": "Bearer {{auth_token}}",
                "type": "text"
              }
            ],
            "url": {
              "raw": "{{base_url}}/api/logout",
              "host": ["{{base_url}}"],
              "path": ["api", "logout"]
            }
          }
        }
      ]
    },
    {
      "name": "🎮 JEUX ET CATÉGORIES",
      "item": [
        {
          "name": "Liste des catégories de jeux",
          "event": [
            {
              "listen": "test",
              "script": {
                "exec": [
                  "pm.test(\"Status code is 200\", function () {",
                  "    pm.response.to.have.status(200);",
                  "});",
                  "",
                  "pm.test(\"Has game categories\", function () {",
                  "    const jsonData = pm.response.json();",
                  "    pm.expect(jsonData.success).to.be.true;",
                  "    pm.expect(jsonData).to.have.property('data');",
                  "    pm.expect(jsonData.data).to.be.an('array');",
                  "});"
                ],
                "type": "text/javascript"
              }
            }
          ],
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Accept",
                "value": "application/json",
                "type": "text"
              }
            ],
            "url": {
              "raw": "{{base_url}}/api/game-categories",
              "host": ["{{base_url}}"],
              "path": ["api", "game-categories"]
            }
          }
        },
        {
          "name": "Liste des jeux",
          "event": [
            {
              "listen": "test",
              "script": {
                "exec": [
                  "pm.test(\"Status code is 200\", function () {",
                  "    pm.response.to.have.status(200);",
                  "});",
                  "",
                  "pm.test(\"Has games\", function () {",
                  "    const jsonData = pm.response.json();",
                  "    pm.expect(jsonData.success).to.be.true;",
                  "    pm.expect(jsonData).to.have.property('data');",
                  "    pm.expect(jsonData.data).to.be.an('array');",
                  "});"
                ],
                "type": "text/javascript"
              }
            }
          ],
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Accept",
                "value": "application/json",
                "type": "text"
              }
            ],
            "url": {
              "raw": "{{base_url}}/api/games",
              "host": ["{{base_url}}"],
              "path": ["api", "games"]
            }
          }
        }
      ]
    },
    {
      "name": "📅 ÉVÉNEMENTS",
      "item": [
        {
          "name": "Liste des événements",
          "event": [
            {
              "listen": "test",
              "script": {
                "exec": [
                  "pm.test(\"Status code is 200\", function () {",
                  "    pm.response.to.have.status(200);",
                  "});",
                  "",
                  "pm.test(\"Has events\", function () {",
                  "    const jsonData = pm.response.json();",
                  "    pm.expect(jsonData.success).to.be.true;",
                  "    pm.expect(jsonData).to.have.property('data');",
                  "});"
                ],
                "type": "text/javascript"
              }
            }
          ],
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Accept",
                "value": "application/json",
                "type": "text"
              }
            ],
            "url": {
              "raw": "{{base_url}}/api/events",
              "host": ["{{base_url}}"],
              "path": ["api", "events"]
            }
          }
        }
      ]
    },
    {
      "name": "🌟 CONTENU PUBLIC",
      "item": [
        {
          "name": "Ambassadeurs",
          "event": [
            {
              "listen": "test",
              "script": {
                "exec": [
                  "pm.test(\"Status code is 200\", function () {",
                  "    pm.response.to.have.status(200);",
                  "});",
                  "",
                  "pm.test(\"Has ambassadors\", function () {",
                  "    const jsonData = pm.response.json();",
                  "    pm.expect(jsonData.success).to.be.true;",
                  "    pm.expect(jsonData).to.have.property('data');",
                  "});"
                ],
                "type": "text/javascript"
              }
            }
          ],
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Accept",
                "value": "application/json",
                "type": "text"
              }
            ],
            "url": {
              "raw": "{{base_url}}/api/ambassadors",
              "host": ["{{base_url}}"],
              "path": ["api", "ambassadors"]
            }
          }
        },
        {
          "name": "Partenaires",
          "event": [
            {
              "listen": "test",
              "script": {
                "exec": [
                  "pm.test(\"Status code is 200\", function () {",
                  "    pm.response.to.have.status(200);",
                  "});",
                  "",
                  "pm.test(\"Has partners\", function () {",
                  "    const jsonData = pm.response.json();",
                  "    pm.expect(jsonData.success).to.be.true;",
                  "    pm.expect(jsonData).to.have.property('data');",
                  "});"
                ],
                "type": "text/javascript"
              }
            }
          ],
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Accept",
                "value": "application/json",
                "type": "text"
              }
            ],
            "url": {
              "raw": "{{base_url}}/api/partners",
              "host": ["{{base_url}}"],
              "path": ["api", "partners"]
            }
          }
        }
      ]
    },
    {
      "name": "🧪 TESTS API",
      "item": [
        {
          "name": "Test API",
          "event": [
            {
              "listen": "test",
              "script": {
                "exec": [
                  "pm.test(\"Status code is 200\", function () {",
                  "    pm.response.to.have.status(200);",
                  "});",
                  "",
                  "pm.test(\"API is working\", function () {",
                  "    const jsonData = pm.response.json();",
                  "    pm.expect(jsonData.success).to.be.true;",
                  "    pm.expect(jsonData.message).to.eql('API is working!');",
                  "});"
                ],
                "type": "text/javascript"
              }
            }
          ],
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Accept",
                "value": "application/json",
                "type": "text"
              }
            ],
            "url": {
              "raw": "{{base_url}}/api/test",
              "host": ["{{base_url}}"],
              "path": ["api", "test"]
            }
          }
        }
      ]
    }
  ],
  "event": [
    {
      "listen": "prerequest",
      "script": {
        "type": "text/javascript",
        "exec": [
          "// Script exécuté avant chaque requête",
          "console.log('Exécution de la requête:', pm.info.requestName);",
          "console.log('Token disponible:', !!pm.collectionVariables.get('auth_token'));"
        ]
      }
    },
    {
      "listen": "test",
      "script": {
        "type": "text/javascript",
        "exec": [
          "// Tests globaux après chaque requête",
          "if (pm.response.code >= 400) {",
          "    console.log('Erreur dans la réponse:', pm.response.json());",
          "}"
        ]
      }
    }
  ],
  "variable": [
    {
      "key": "base_url",
      "value": "https://acmpt.online",
      "type": "string"
    },
    {
      "key": "auth_token",
      "value": "",
      "type": "string"
    },
    {
      "key": "user_id",
      "value": "",
      "type": "string"
    },
    {
      "key": "username",
      "value": "",
      "type": "string"
    }
  ]
}
```

## 🔧 Variables d'environnement

La collection utilise ces variables :

- **`base_url`** : `https://ebetstream.com` (URL de base de l'API)
- **`auth_token`** : Token d'authentification (rempli automatiquement)
- **`user_id`** : ID de l'utilisateur (rempli automatiquement)
- **`username`** : Nom d'utilisateur (rempli automatiquement)

## 📝 Format d'inscription

### **Endpoint** : `POST /api/register`

### **Corps de la requête** :
```json
{
    "username": "testuser_123",
    "email": "testuser_123@example.com",
    "password": "password123",
    "password_confirmation": "password123",
    "promo_code": ""
}
```

### **Champs obligatoires** :
- ✅ `username` : Nom d'utilisateur unique (max 50 caractères)
- ✅ `email` : Email valide et unique
- ✅ `password` : Mot de passe (min 6 caractères)
- ✅ `password_confirmation` : Confirmation du mot de passe

### **Champs optionnels** :
- 🔸 `promo_code` : Code de bienvenue ou de parrainage

### **Réponse attendue** :
```json
{
    "success": true,
    "message": "User registered successfully",
    "user": {
        "id": 1,
        "username": "testuser_123",
        "email": "testuser_123@example.com",
        "promo_code": "ABC123XYZ",
        "created_at": "2025-12-30T09:40:00.000000Z"
    },
    "token": "1|abc123def456...",
    "welcome_bonus": 0,
    "premium_days": 0,
    "first_deposit_bonus_percentage": 0
}
```

## 🎯 Utilisation

1. **Testez l'inscription** : Lancez la requête "1️⃣ Inscription Utilisateur"
2. **Token sauvegardé** : Le token est automatiquement sauvegardé dans les variables
3. **Testez la connexion** : Utilisez "2️⃣ Connexion Utilisateur" avec les mêmes identifiants
4. **Accès protégé** : Les requêtes suivantes utilisent automatiquement le token

## 🧪 Tests inclus

Chaque requête inclut des tests automatiques :
- ✅ Vérification du status code (200)
- ✅ Validation de la structure de la réponse
- ✅ Sauvegarde automatique du token
- ✅ Logs dans la console Postman

**Importez cette collection et testez votre API Ebetstream facilement !** 🚀
