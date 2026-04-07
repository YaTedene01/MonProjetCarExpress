# MonProjetCarExpress

Plateforme web complète pour la location et l'achat de véhicules, avec trois espaces:

- `Client`
- `Agence`
- `Super Admin`

Le projet est composé de:

- un frontend React/Vite (`carexpress-react`)
- une API Laravel (`backend-api`)
- une base PostgreSQL
- une stack Docker unifiée pour exécution et déploiement

---

## Sommaire

- [Architecture](#architecture)
- [Prérequis](#prérequis)
- [Démarrage rapide (Docker recommandé)](#démarrage-rapide-docker-recommandé)
- [Lancement en mode dev sans Docker](#lancement-en-mode-dev-sans-docker)
- [Variables d'environnement](#variables-denvironnement)
- [Comptes de démonstration](#comptes-de-démonstration)
- [Déploiement](#déploiement)
- [Commandes utiles](#commandes-utiles)
- [Troubleshooting](#troubleshooting)
- [Documentation détaillée](#documentation-détaillée)

---

## Architecture

```text
Utilisateur
   |
   v
Nginx Gateway (docker service: gateway)
   |--------------------> Frontend React (docker service: frontend)
   |
   \--------------------> API Laravel (docker service: backend) ---> PostgreSQL (docker service: db)
```

Routage principal:

- `/` -> frontend
- `/api/*` -> backend
- `/up` -> healthcheck backend
- `/api/documentation` -> Swagger API

---

## Prérequis

### Pour Docker (recommandé)

- Docker
- Docker Compose v2

### Pour dev local sans Docker

- Node.js 18+
- npm
- PHP 8.3+
- Composer
- PostgreSQL 15+

---

## Démarrage rapide (Docker recommandé)

Depuis la racine du projet:

```bash
cp .env.docker.example .env
docker compose up -d --build
```

Accès:

- Frontend: `http://localhost`
- API: `http://localhost/api/v1`
- Swagger: `http://localhost/api/documentation`
- Healthcheck: `http://localhost/up`

Voir les logs:

```bash
docker compose logs -f
```

Arrêter:

```bash
docker compose down
```

Arrêter + supprimer les volumes DB:

```bash
docker compose down -v
```

---

## Lancement en mode dev sans Docker

### 1) Backend API

```bash
cd backend-api
cp .env.example .env
composer install
php artisan key:generate
php artisan migrate --seed
php artisan serve
```

Backend disponible sur `http://127.0.0.1:8000`.

### 2) Frontend

```bash
cd carexpress-react
cp .env.example .env
npm install
npm run dev
```

Frontend disponible sur `http://127.0.0.1:5173`.

---

## Variables d'environnement

### Racine (`.env` utilisé par `docker compose`)

Exemple complet: [`.env.docker.example`](/home/ya-tedene/Téléchargements/MonProjetCarExpress/.env.docker.example)

Variables importantes:

- `APP_URL`
- `APP_KEY`
- `POSTGRES_DB`
- `POSTGRES_USER`
- `POSTGRES_PASSWORD`
- `VITE_API_BASE_URL` (laisser vide pour same-origin via gateway)
- `CORS_ALLOWED_ORIGINS`
- `SANCTUM_STATEFUL_DOMAINS`

### Backend (`backend-api/.env`)

Référence: [`backend-api/.env.example`](/home/ya-tedene/Téléchargements/MonProjetCarExpress/backend-api/.env.example)

### Frontend (`carexpress-react/.env`)

Référence: [`carexpress-react/.env.example`](/home/ya-tedene/Téléchargements/MonProjetCarExpress/carexpress-react/.env.example)

---

## Comptes de démonstration

- Admin: `admin@carexpress.sn` / `admin12345`
- Client: `client@carexpress.sn` / `client12345`
- Agence: `agency+dakar-auto-services@carexpress.sn` / `agency12345`

---

## Déploiement

Guide détaillé: [DEPLOYMENT.md](/home/ya-tedene/Téléchargements/MonProjetCarExpress/DEPLOYMENT.md)

### Déploiement VPS (résumé)

```bash
git clone <repo>
cd MonProjetCarExpress
cp .env.docker.example .env
# éditer .env
docker compose up -d --build
```

Pour HTTPS, placez un reverse proxy TLS devant la stack (`Nginx Proxy Manager`, `Traefik`, `Caddy`, etc.).

---

## Commandes utiles

Rebuild complet:

```bash
docker compose up -d --build
```

Rebuild backend uniquement:

```bash
docker compose up -d --build backend
```

Migrations manuelles:

```bash
docker compose exec backend php artisan migrate --force
```

Accéder au shell backend:

```bash
docker compose exec backend sh
```

---

## Troubleshooting

### Le backend ne démarre pas (DB pas prête)

Le script de démarrage backend fait déjà des retries migration. Vérifiez:

```bash
docker compose logs -f backend db
```

### Erreur CORS

Vérifiez dans `.env` (racine ou backend selon mode):

- `CORS_ALLOWED_ORIGINS`
- `SANCTUM_STATEFUL_DOMAINS`

### Le frontend n’appelle pas la bonne API

En Docker via gateway, laissez `VITE_API_BASE_URL=` vide.

### Port déjà utilisé

Changez `GATEWAY_PORT` dans `.env` puis relancez:

```bash
docker compose up -d --build
```

---

## Documentation détaillée

- Backend: [backend-api/README.md](/home/ya-tedene/Téléchargements/MonProjetCarExpress/backend-api/README.md)
- Frontend: [carexpress-react/README.md](/home/ya-tedene/Téléchargements/MonProjetCarExpress/carexpress-react/README.md)
- Déploiement Docker: [DEPLOYMENT.md](/home/ya-tedene/Téléchargements/MonProjetCarExpress/DEPLOYMENT.md)

---

## État actuel

- Docker unifié prêt (`frontend + backend + db + gateway`)
- API Laravel documentée via Swagger
- Front React multi-rôles branché sur l'API
- Flux agence avec validation admin avant connexion
