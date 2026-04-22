# MonProjetCarExpress

Plateforme web complète de location et d'achat de véhicules avec trois espaces métier:

- `Client`
- `Agence`
- `Super Admin`

Le projet repose sur une architecture full-stack simple à lancer en local:

- un frontend React + Vite dans [`carexpress-react`](/home/ya-tedene/Téléchargements/MonProjetCarExpress/carexpress-react)
- une API Laravel dans [`backend-api`](/home/ya-tedene/Téléchargements/MonProjetCarExpress/backend-api)
- une base de données PostgreSQL
- une stack Docker avec gateway Nginx

## Sommaire

- [Fonctionnalités](#fonctionnalités)
- [Architecture](#architecture)
- [Prérequis](#prérequis)
- [Démarrage rapide avec Docker](#démarrage-rapide-avec-docker)
- [Lancement en développement sans Docker](#lancement-en-développement-sans-docker)
- [Variables d'environnement](#variables-denvironnement)
- [Comptes de démonstration](#comptes-de-démonstration)
- [Commandes utiles](#commandes-utiles)
- [Déploiement](#déploiement)
- [Versionning Et CI/CD](#versionning-et-cicd)
- [Documentation complémentaire](#documentation-complémentaire)

## Fonctionnalités

- Catalogue public de véhicules à louer ou à acheter
- Authentification séparée pour client, agence et super admin
- Gestion du profil client et de l'agence
- Réservations de véhicules côté client avec vérification de disponibilité, contrôle des chevauchements et validation métier
- Demandes d'achat côté client
- Gestion des véhicules, réservations et demandes d'achat côté agence
- Workflow agence avec demande d'enregistrement, validation admin, première connexion puis activation du compte
- Demande agence avec envoi de logo et de plusieurs documents justificatifs
- Boutons et accès d'administration conditionnés par le statut réel de l'agence
- Modération des annonces agence: une annonce publiée par l'agence doit être validée par l'admin avant d'être visible côté client
- Tarification centralisée pour les annonces de location et d'achat, avec calcul automatique de la part administration
- Affichage des conditions et tarifications côté agence avant l'envoi d'une demande
- Documentation API OpenAPI / Swagger

## Règles métier importantes

### Réservations location

- Un client ne peut réserver qu'un véhicule de location réellement disponible
- Une réservation est refusée si les dates se chevauchent avec une réservation `pending` ou `confirmed`
- Les heures choisies côté client sont transmises à l'API et conservées dans la réservation

### Cycle de vie d'une agence

- Une agence peut envoyer une demande d'enregistrement avec ses informations administratives, son logo, ses documents et son mot de passe
- L'admin peut ouvrir une demande, voir directement le logo et les fichiers joints, puis télécharger les pièces si nécessaire
- Quand l'admin enregistre cette demande, les informations de l'agence créée reprennent celles transmises dans la demande
- Après enregistrement par l'admin, l'agence reste en statut `pending`
- Le statut passe à `active` lors de la première connexion réussie de l'agence
- Tant qu'une agence n'a pas encore effectué cette première connexion, le bouton `Voir` côté admin reste désactivé
- Tant qu'une agence n'a pas encore créé d'annonces, son espace agence n'affiche aucun véhicule

### Cycle de vie d'une annonce agence

- Quand une agence publie une annonce, celle-ci est créée en statut `pending`
- L'admin reçoit une alerte de modération pour cette nouvelle annonce
- Tant que l'admin n'a pas validé l'annonce, elle n'est pas visible dans le catalogue client
- Après validation admin, une annonce de location passe en `available` et une annonce de vente passe en `for_sale`

### Tarification agence

La commission administration est calculée automatiquement à partir du prix saisi par l'agence.

#### Location

| Prix | % admin |
| --- | ---: |
| 20.000 à 29.000 F CFA / jour | 15% |
| 30.000 à 39.000 F CFA / jour | 20% |
| 40.000 à 49.000 F CFA / jour | 25% |
| 50.000 à 100.000 F CFA / jour | 30% |
| 100.000 F CFA / jour et + | 35% |

#### Achat

| Prix | % admin |
| --- | ---: |
| 500.000 à 1.000.000 F CFA | 15% |
| 1.000.000 à 2.000.000 F CFA | 20% |
| 2.000.000 à 3.000.000 F CFA | 25% |
| 3.000.000 à 4.999.999 F CFA | 30% |
| 5.000.000 F CFA et + | 35% |

Note:
- la part admin est affichée à l'agence dans le formulaire d'annonce
- le montant admin est recalculé côté backend à chaque création ou modification d'annonce
- un prix hors grille est refusé

## Architecture

```text
Navigateur
   |
   v
Nginx Gateway (service: gateway)
   |--------------------> Frontend React (service: frontend)
   |
   \--------------------> API Laravel (service: backend) ---> PostgreSQL (service: db)
```

Routage principal:

- `/` -> frontend
- `/api/v1/*` -> API applicative
- `/api/documentation` -> interface Swagger
- `/api/docs/openapi.json` -> schéma OpenAPI JSON
- `/up` -> healthcheck backend

## Prérequis

### Avec Docker

- Docker
- Docker Compose v2

### Sans Docker

- Node.js 18+
- npm
- PHP 8.3+
- Composer
- PostgreSQL 16 recommandé

## Démarrage rapide avec Docker

Depuis la racine du projet:

```bash
cp .env.docker.example .env
docker compose up -d --build
```

Une fois la stack démarrée:

- Frontend: `http://localhost`
- API: `http://localhost/api/v1`
- Swagger: `http://localhost/api/documentation`
- OpenAPI JSON: `http://localhost/api/docs/openapi.json`
- Healthcheck: `http://localhost/up`

Commandes utiles:

```bash
docker compose logs -f
docker compose down
docker compose down -v
```

## Lancement en développement sans Docker

### Backend Laravel

```bash
cd backend-api
cp .env.example .env
composer install
php artisan key:generate
php artisan migrate --seed
php artisan serve
```

API disponible sur `http://127.0.0.1:8000`.

Option utile pour préparer rapidement le backend:

```bash
cd backend-api
composer run setup
```

### Frontend React

```bash
cd carexpress-react
cp .env.example .env
npm install
npm run dev
```

Frontend disponible sur `http://127.0.0.1:5173`.

En mode local sans gateway Docker, la variable `VITE_API_BASE_URL` doit généralement pointer vers `http://127.0.0.1:8000`.

## Variables d'environnement

### Racine du projet (`.env` pour Docker Compose)

Copiez [`.env.docker.example`](/home/ya-tedene/Téléchargements/MonProjetCarExpress/.env.docker.example) vers `.env`.

Variables importantes:

- `APP_URL`
- `APP_KEY`
- `POSTGRES_DB`
- `POSTGRES_USER`
- `POSTGRES_PASSWORD`
- `GATEWAY_PORT`
- `VITE_API_BASE_URL`
- `CORS_ALLOWED_ORIGINS`
- `SANCTUM_STATEFUL_DOMAINS`

Conseil:

- en Docker via la gateway Nginx, laissez `VITE_API_BASE_URL=` vide pour utiliser les appels same-origin vers `/api/v1`

### Backend (`backend-api/.env`)

Fichier de référence: [`backend-api/.env.example`](/home/ya-tedene/Téléchargements/MonProjetCarExpress/backend-api/.env.example)

Variables clés:

- `APP_URL`
- `DB_HOST`
- `DB_PORT`
- `DB_DATABASE`
- `DB_USERNAME`
- `DB_PASSWORD`
- `DB_SSLMODE`
- `L5_SWAGGER_CONST_HOST`
- `PORT`

### Frontend (`carexpress-react/.env`)

Fichier de référence: [`carexpress-react/.env.example`](/home/ya-tedene/Téléchargements/MonProjetCarExpress/carexpress-react/.env.example)

Variable principale:

- `VITE_API_BASE_URL`

## Comptes de démonstration

Comptes présents dans les seeders:

- Super Admin: `admin@carexpress.sn` / `admin12345`
- Client: `client@carexpress.sn` / `client12345`
- Agence: `agency+dakar-auto-services@carexpress.sn` / `agency12345`

Connexion admin dans l'interface:

- Email: `admin@carexpress.sn`
- Mot de passe: `admin12345`
- Code 2FA à saisir dans le formulaire: `123456`

Note:
- le champ `Code 2FA` est actuellement utilisé côté interface de démonstration pour accéder à l'espace super admin

Compte provisoire créé par l'admin:

- lorsqu'une agence est enregistrée manuellement depuis l'espace admin, un compte partenaire est créé avec le mot de passe provisoire `agency12345`
- ce compte reste en attente jusqu'à sa première connexion réussie

## Commandes utiles

Depuis la racine:

```bash
docker compose up -d --build
docker compose up -d --build backend
docker compose exec backend php artisan migrate --force
docker compose exec backend php artisan db:seed --force
docker compose exec backend sh
```

Depuis `backend-api`:

```bash
composer test
php artisan test
php artisan test --filter=TarificationServiceTest
```

Depuis `carexpress-react`:

```bash
npm run dev
npm run build
```

## Déploiement

Un guide plus détaillé est disponible ici: [DEPLOYMENT.md](/home/ya-tedene/Téléchargements/MonProjetCarExpress/DEPLOYMENT.md)

Résumé:

```bash
git clone <repo>
cd MonProjetCarExpress
cp .env.docker.example .env
docker compose up -d --build
```

Pour une mise en production, placez idéalement un reverse proxy TLS devant la stack pour gérer HTTPS.

## Versionning Et CI/CD

Le dépôt inclut maintenant une intégration `GitLab CI/CD` via [`.gitlab-ci.yml`](/home/ya-tedene/Téléchargements/MonProjetCarExpress/.gitlab-ci.yml).

Pipeline actuellement en place:

- `backend:quality`
  exécute `Laravel Pint` pour le contrôle qualité PHP
- `backend:test`
  lance les migrations puis les tests Laravel avec PostgreSQL
- `frontend:build`
  compile le frontend React avec `npm run build`
- `docker:build`
  vérifie que les images Docker backend et frontend se construisent
- `deploy:production`
  job manuel de déploiement depuis `main` si les variables SSH sont configurées

Le détail complet de la stratégie de déploiement, de versionning et de CI/CD est documenté dans [DEPLOYMENT.md](/home/ya-tedene/Téléchargements/MonProjetCarExpress/DEPLOYMENT.md).

## Documentation complémentaire

- Backend: [backend-api/README.md](/home/ya-tedene/Téléchargements/MonProjetCarExpress/backend-api/README.md)
- Frontend: [carexpress-react/README.md](/home/ya-tedene/Téléchargements/MonProjetCarExpress/carexpress-react/README.md)
- Déploiement: [DEPLOYMENT.md](/home/ya-tedene/Téléchargements/MonProjetCarExpress/DEPLOYMENT.md)

## État du projet

- Stack Docker unifiée opérationnelle
- Frontend React multi-rôles
- API Laravel structurée par domaines et rôles
- Base PostgreSQL seedée pour démo locale
- Documentation Swagger intégrée
