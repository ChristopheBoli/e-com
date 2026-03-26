# API E-Commerce Laravel

Backend API Laravel 13 pour une application de gestion commerciale avec module panier/checkout, architecture en couches (Controllers, Services, Repositories, Models, Requests, Middleware), JWT auth, module admin, tests, seeders et installateur web.

## Prérequis

- PHP 8.3+
- Composer
- Base de données (supportée: MySQL 5.7+, MariaDB 10.3+, PostgreSQL 12+, SQLite 3.8+)
- Extensions PHP: `mbstring`, `openssl`, `pdo`, `tokenizer`, `xml`, `ctype`, `json`, `bcmath`

## Installation

### Méthode 1: Clone du code source

```bash
git clone https://github.com/ChristopheBoli/e-com.git
cd e-com
composer install
```

### Méthode 2: Téléchargement direct

Vous pouvez télécharger le fichier zip du projet depuis le repo GitHub et le dézipper.

### Installation via l'installateur Web (Recommandé)

L'application propose un installateur web automatisé accessible via `/install`.

1. **Lancez le serveur de développement:**

```bash
php artisan serve
```

2. **Accédez à la page d'installation:**

```
http://localhost:8000/install
```

3. **Remplissez le formulaire:**

| Champ | Description | Requis |
|-------|-------------|---------|
| Type de base | MySQL, MariaDB, PostgreSQL ou SQLite | Oui |
| Hôte DB | Adresse du serveur de base de données | Non (127.0.0.1 par défaut) |
| Port DB | Port du serveur de base de données | Non (3306 par défaut) |
| Nom de la base | Nom de la base de données à utiliser/créer | Oui |
| Utilisateur DB | Nom d'utilisateur de la base de données | Non |
| Mot de passe DB | Mot de passe de la base de données | Non |
| Nom admin | Nom de l'administrateur | Oui |
| Email admin | Email de l'administrateur | Oui |
| Mot de passe admin | Mot de passe de l'administrateur | Oui |
| Confirmation MDP | Confirmation du mot de passe | Oui |
| Mode d'installation | `demo` (avec données de test) ou `simple` (vide) | Oui |
| Install token | Token de sécurité (configuré dans `.env`) | Oui |

4. **Modes d'installation:**

- **Mode Démo**: Installe avec des produits de test (10 produits) et un utilisateur de démonstration
- **Mode Simple**: Installation sans données de test (seulement le compte admin)

5. **Ce que fait l'installateur:**

- Applique la configuration DB sans redémarrer le serveur
- Génère `APP_KEY` (si non existant)
- Génère `JWT_SECRET` (si non existant)
- Exécute les migrations Laravel
- Exécute `php artisan storage:link --force` pour rendre les fichiers publics accessibles
- Exécute les seeders selon le mode choisi
- Crée les comptes administrateurs (deux admins, un admin automatique et un admin avec les identifiants saisis)
- Crée le fichier de verrou `storage/app/install.lock`
- Positionne `APP_INSTALLED=true` dans `.env`
- Redirige vers la page de succès avec les identifiants

### Installation Manuelle

Si vous préférez une installation manuelle:

1. **Copiez le fichier d'environnement:**

```bash
cp .env.example .env
```

2. **Configurez les variables dans `.env`:**

```env
APP_NAME=E-com
APP_ENV=local
APP_KEY=
APP_DEBUG=true
APP_URL=http://localhost:8000

# Base de données
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=ecom
DB_USERNAME=root
DB_PASSWORD=

# JWT
JWT_SECRET=

# Installation (optionnel pour l'installateur web)
INSTALL_TOKEN=secret-token
INSTALL_ALLOWED_IN_PRODUCTION=false
```

3. **Générez les clés:**

```bash
php artisan key:generate
php artisan jwt:secret --force
```

4. **Migrez, créez le lien de stockage et peuplez la base de données:**

```bash
php artisan migrate --seed
php artisan storage:link --force
```

## Configuration de l'Installateur

Pour utiliser l'installateur web, configurez ces variables dans `.env`:

| Variable | Description | Valeur par défaut |
|----------|-------------|------------------|
| `INSTALL_TOKEN` | Token requis pour lancer l'installation | `secret-token` |
| `INSTALL_ALLOWED_IN_PRODUCTION` | Autorise l'installation en production | `false` |
| `APP_INSTALLED` | État de l'installation (géré automatiquement) | `false` |

## Réinitialisation de l'Installation

Une route `/reset-install` permet de réinitialiser l'installation pour effectuer des tests ou réinstaller l'application.

**Accès:** `http://localhost:8000/reset-install`

**Fonctionnalités:**

- Suppression du fichier de verrou `install.lock`
- Suppression du fichier de statut `install-status.json`
- Positionnement de `APP_INSTALLED=false`
- Option de suppression de toutes les tables de la base de données
- Nettoyage du cache de l'application

**Protection en production:**

Par défaut, la réinitialisation est bloquée en production. Pour l'autoriser:

```env
RESET_ALLOWED_IN_PRODUCTION=true
```

## Comptes de Démonstration

Après installation en mode démo, ces identifiants sont disponibles sur la page `/install/done`:

- **Administrateur:**
  - Email: `admin@example.com` (ou email saisi)
  - Mot de passe: `adminpassword` (ou mot de passe saisi)

- **Utilisateur Démo:**
  - Email: `user@example.com`
  - Mot de passe: `userpassword`

## Endpoints API

### Authentification

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| POST | `/api/auth/register` | Inscription d'un nouvel utilisateur |
| POST | `/api/auth/login` | Connexion et génération du token JWT |
| GET | `/api/auth/me` | Profil de l'utilisateur connecté (auth) |
| POST | `/api/auth/logout` | Déconnexion et invalidation du token (auth) |

**Header d'authentification:**
```
Authorization: Bearer {jwt_token}
```

### Produits (Public)

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/products` | Liste des produits actifs (paginée) |
| GET | `/api/products/{id}` | Détails d'un produit actif |

### Panier (Authentifié)

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/cart` | Récupérer le panier actif |
| POST | `/api/cart/add` | Ajouter un produit au panier |
| PUT | `/api/cart/update` | Modifier la quantité d'un article |
| DELETE | `/api/cart/remove` | Supprimer un article du panier |
| POST | `/api/cart/items` | Ajouter un article (REST) |
| PATCH | `/api/cart/items` | Modifier quantité (REST) |
| DELETE | `/api/cart/items` | Supprimer un article (REST) |
| DELETE | `/api/cart` | Vider le panier |

### Commandes (Authentifié)

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| POST | `/api/checkout` | Valider le panier et créer une commande |

### Administration (Authentifié + Rôle Admin)

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/admin/products` | Liste de tous les produits (actifs et inactifs) |
| GET | `/api/admin/products/{id}` | Détails d'un produit |
| POST | `/api/admin/products` | Créer un nouveau produit |
| PUT | `/api/admin/products/{id}` | Modifier un produit existant |
| DELETE | `/api/admin/products/{id}` | Supprimer un produit |

## Structure du Projet

```
ecom/
├── app/
│   ├── Console/               # Commandes Artisan
│   ├── Http/
│   │   ├── Controllers/       # Contrôleurs HTTP
│   │   ├── Middleware/       # Middleware (auth, admin, install)
│   │   └── Requests/        # Validation des requêtes
│   ├── Models/               # Modèles Eloquent
│   ├── Repositories/          # Pattern Repository pour accès aux données
│   ├── Services/             # Logique métier
│   └── Providers/           # Fournisseurs de services Laravel
├── database/
│   ├── migrations/           # Migrations de la base de données
│   └── seeders/             # Données de démonstration
├── resources/
│   ├── views/                # Templates Blade
│   └── ...
├── routes/
│   ├── api.php               # Routes API
│   └── web.php               # Routes Web
├── storage/                  # Fichiers stockés (cache, logs, locks)
├── tests/
│   ├── Feature/              # Tests d'intégration
│   └── Unit/                # Tests unitaires
└── .env                     # Variables d'environnement
```

## Architecture

### Couches de l'application

| Couche | Responsabilité | Répertoire |
|--------|----------------|------------|
| **Controllers** | Gestion des requêtes/réponses HTTP | `app/Http/Controllers` |
| **Services** | Logique métier et orchestration | `app/Services` |
| **Repositories** | Accès aux données et requêtes DB | `app/Repositories` |
| **Models** | Entités et relations Eloquent | `app/Models` |
| **Requests** | Validation des entrées utilisateur | `app/Http/Requests` |
| **Middleware** | Filtrage des requêtes (auth, roles) | `app/Http/Middleware` |

### Services Principaux

| Service | Responsabilités |
|---------|-----------------|
| `AuthService` | Inscription, connexion, déconnexion, profil |
| `CartService` | Ajout, modification, suppression, calcul total |
| `OrderService` | Checkout, validation stock, création commande |
| `ProductService` | CRUD produits, slug, status actif/inactif |
| `InstallService` | Installation automatisée, config, migrations |
| `ResetInstallService` | Réinitialisation de l'installation |

## Règles Métier

- Un utilisateur ne possède qu'un seul panier actif
- Les prix sont stockés en **cents** (`price_cents`, `total_cents`) pour éviter les erreurs de précision
- Le prix d'un produit dans le panier est **snapshot** (conservé au moment de l'ajout) pour protéger contre les changements de prix futurs
- Validation du stock avant ajout au panier
- Décrémentation atomique du stock lors du checkout (`lockForUpdate()`)
- Un panier complété passe en statut `completed` et un nouveau panier actif est créé automatiquement
- Les commandes passent du statut `pending` à `paid`

## Modélisation de la Base de Données

### Users
| Colonne | Type | Description |
|---------|------|-------------|
| id | bigint unsigned | Identifiant unique |
| name | string | Nom de l'utilisateur |
| email | string unique | Email (utilisé pour connexion) |
| password | string | Hash du mot de passe |
| role | enum | `admin` ou `user` |
| created_at | timestamp | Date de création |

### Products
| Colonne | Type | Description |
|---------|------|-------------|
| id | bigint unsigned | Identifiant unique |
| name | string | Nom du produit |
| slug | string unique | Slug pour l'URL |
| sku | string unique | Référence produit |
| description | text | Description du produit |
| price_cents | int | Prix en cents |
| stock_quantity | int | Quantité en stock |
| is_active | boolean | Produit actif (visible publiquement) |
| created_at | timestamp | Date de création |

### Carts
| Colonne | Type | Description |
|---------|------|-------------|
| id | bigint unsigned | Identifiant unique |
| user_id | bigint unsigned | FK vers users |
| status | enum | `active` ou `completed` |
| created_at | timestamp | Date de création |

### Cart Items
| Colonne | Type | Description |
|---------|------|-------------|
| id | bigint unsigned | Identifiant unique |
| cart_id | bigint unsigned | FK vers carts |
| product_id | bigint unsigned | FK vers products |
| quantity | int | Quantité |
| unit_price_cents | int | Prix au moment de l'ajout |
| Unique constraint | `(cart_id, product_id)` | Un produit ne peut être qu'une fois par panier |

### Orders
| Colonne | Type | Description |
|---------|------|-------------|
| id | bigint unsigned | Identifiant unique |
| user_id | bigint unsigned | FK vers users |
| order_number | string unique | Numéro de commande unique |
| total_cents | int | Total en cents |
| status | enum | `pending` ou `paid` |
| items_snapshot | json | Snapshot des items (JSON) |
| placed_at | timestamp | Date de passage de commande |

## Sécurité

- **Authentification JWT**: Tokens JWT avec expiration
- **Validation des entrées**: Form Requests avec validation Laravel
- **Protection des routes**: Middleware pour les routes d'authentification et admin
- **Rôles**: Séparation entre utilisateurs `admin` et `user`
- **Protection CSRF**: Token CSRF sur les formulaires web
- **SQL Injection**: Utilisation d'Eloquent ORM (requêtes paramétrées)
- **Hachage des mots de passe**: Bcrypt via Laravel

## Tests

```bash
# Exécuter tous les tests
php artisan test

# Exécuter avec couverture
php artisan test --coverage

# Tests spécifiques
php artisan test --testsuite=Unit
php artisan test --testsuite=Feature
```

### Suites de tests

| Suite | Description |
|--------|-------------|
| `Unit/CartServiceTest` | Opérations panier, calcul total |
| `Unit/OrderServiceTest` | Logique de checkout |
| `Feature/AuthFlowTest` | Flux complet d'authentification |
| `Feature/CartCheckoutFlowTest` | Flow panier → checkout |
| `Feature/AdminAccessTest` | Contrôle d'accès admin |

## Commandes Utiles

```bash
# Démarrer le serveur de développement
php artisan serve

# Exécuter les migrations
php artisan migrate

# Annuler la dernière migration
php artisan migrate:rollback

# Recréer la base de données (migration rollback + remigrate)
php artisan migrate:refresh

# Nettoyer le cache
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear

# Afficher les routes
php artisan route:list

# Seeding
php artisan db:seed
```

## Dépannage

### Problème d'installation

**Erreur 403 sur /install:**
- Vérifiez que `storage/app/install.lock` n'existe pas
- Vérifiez que `APP_INSTALLED` n'est pas déjà `true` dans `.env`
- Utilisez `/reset-install` pour réinitialiser l'installation

**Erreur de connexion base de données:**
- Vérifiez les identifiants dans `.env`
- Assurez-vous que le serveur MySQL/MariaDB est en cours d'exécution
- Vérifiez que l'utilisateur a les droits nécessaires sur la base

### Logs

Les logs Laravel sont stockés dans `storage/logs/laravel.log`.

```bash
# Suivre les logs en temps réel
tail -f storage/logs/laravel.log
```

## Licence

Ce projet est propriétaire. Tous droits réservés.

## Support

Pour toute question ou problème de configuration, n'hésitez pas à me contactez.


 ❌ Ce qui manque selon votre document

  1. Module Administration complet

  Le document demande:
  - POST /admin/products - Manquant (existe mais peut-être incomplet)
  - PUT /admin/products/{id} - Manquant
  - DELETE /admin/products/{id} - Manquant

  2. Système de notifications

  Le document mentionne "Email notifications" qui n'existent pas.

  3. Recherche/filtrage

  Le document mentionne "Search/Filtering" avancé (aujourd'hui pagination simple).

  4. Images de produits

  Le document mentionne "Product image upload" qui n'existe pas.



   2026-03-26 14:12:43 /reset-install ............................................................................... ~ 0.23ms
  2026-03-26 14:12:43 /favicon.ico ................................................................................. ~ 0.22ms
  local.INFO: [reset] start {"reset_id":"8925005c-8d02-4b07-a577-3a72bfd3e979","expects_json":false,"drop_database":"1"}
  local.INFO: [reset] run_start
  local.INFO: [reset] step_drop_tables
  local.INFO: [reset] tables_dropped_and_cleaned
  local.INFO: [reset] step_delete_locks
  local.INFO: [reset] locks_deleted {"files":["install.lock","install-status.json"]}
  local.INFO: [reset] step_reset_env
  local.INFO: [reset] env_reset
  local.INFO: [reset] step_clear_cache

   INFO  Environment modified. Restarting server...  

   INFO  Server running on [http://127.0.0.1:8000].  

  Press Ctrl+C to stop the server


  L'install auto doit aussi faire le storage link

    feat(app): Système d'installation:
  - Ajouter storage:link automatique pendant l'installation