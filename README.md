# API E-Commerce Laravel

Backend API Laravel 13 pour une application de gestion commerciale avec module panier/checkout, architecture en couches (Controllers, Services, Repositories, Models, Requests, Middleware), JWT auth, module admin, tests, seeders et installateur web.

## Prérequis

- PHP 8.3+
- Composer
- Base de données (MySQL/MariaDB/PostgreSQL/SQLite)

## Installation rapide

1. Installer les dépendances:

```bash
composer install
```

2. Créer le fichier d’environnement:

```bash
cp .env.example .env
```

3. Générer les clés:

```bash
php artisan key:generate
php artisan jwt:secret --force
```

4. Migrer et seeder:

```bash
php artisan migrate --seed
```

5. Lancer l’application:

```bash
php artisan serve
```

## Système d’installation web (/install)

L’application propose un installateur one-shot via `/install`.

Le formulaire demande:
- DB name
- DB user
- DB password
- admin email
- admin password
- install token

Après validation:
- écrit la configuration DB dans `.env`
- exécute `migrate`
- exécute `db:seed`
- crée/maj l’admin
- crée un verrou `storage/app/install.lock`
- positionne `APP_INSTALLED=true`

Variables à configurer:
- `INSTALL_TOKEN`
- `INSTALL_ALLOWED_IN_PRODUCTION=true|false`
- `APP_INSTALLED=false` (avant première install)

## Comptes seed de démonstration

- Admin: `admin@example.com` / `adminpassword`
- User: `user@example.com` / `userpassword`

## Endpoints API

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me` (auth)
- `POST /api/auth/logout` (auth)

### Produits publics
- `GET /api/products`
- `GET /api/products/{id}`

### Panier (auth)
- `GET /api/cart`
- `POST /api/cart/items`
- `PATCH /api/cart/items`
- `DELETE /api/cart/items`
- `DELETE /api/cart`

### Checkout (auth)
- `POST /api/checkout`

### Admin (auth + role admin)
- `GET /api/admin/products`
- `GET /api/admin/products/{id}`
- `POST /api/admin/products`
- `PUT /api/admin/products/{id}`
- `DELETE /api/admin/products/{id}`

## Exécution des tests

```bash
php artisan test
```

Couvre notamment:
- unit tests panier (ajout, calcul total)
- unit tests checkout
- flow intégration cart -> checkout
- contrôle d’accès admin
- flow auth register/login/me/logout

## Structure principale

- `app/Http/Controllers` : couche HTTP
- `app/Services` : logique métier
- `app/Repositories` : accès données
- `app/Models` : entités Eloquent
- `app/Http/Requests` : validation
- `app/Http/Middleware` : sécurité
