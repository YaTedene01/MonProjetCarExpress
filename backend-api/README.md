# Car Express API

Backend Laravel 13 pour le frontend React `ProjetCarExpress/carexpress-react`.

## Architecture

Le projet suit maintenant une organisation inspirée d'une architecture professionnelle en couches :

- `app/Http/Controllers/Api`
- `app/Http/Requests`
- `app/Http/Resources`
- `app/Console`
- `app/Exceptions`
- `app/Jobs`
- `app/Repository`
- `app/Services`
- `app/Traits`
- `app/Utils`
- `docs`

Le détail est documenté dans [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md).

## Fichiers cles

| Fichier | Role |
|---------|------|
| `routes/api.php` | Definition des endpoints |
| `app/Http/Controllers/Api/*` | Controleurs (validation + appel service) |
| `app/Services/*` | Logique metier |
| `app/Repository/*` | Acces aux donnees |
| `app/Models/*` | Modeles ORM Eloquent |
| `database/migrations/*` | Schema DB |
| `docs/swagger.json` | Documentation API (OpenAPI) |
| `.env.example` | Exemple configuration locale / Railway / Render |
| `Dockerfile` | Image Docker app |
| `docker-compose.yml` | Orchestration locale |
| `render.yaml` | Manifest deploiement Render |

## Stack

- Laravel 13
- PostgreSQL
- Laravel Sanctum
- L5 Swagger / OpenAPI

## Modules

- Authentification par rôles: `client`, `agency`, `admin`
- Catalogue véhicules location / vente
- Réservations location
- Demandes d'achat avec frais de service
- Dashboard agence
- Supervision admin
- Swagger UI sur `/api/documentation`

## Installation

```bash
cp .env.example .env
php artisan key:generate
php artisan migrate:fresh --seed
php artisan l5-swagger:generate
php artisan serve
```

## Docker

```bash
cp .env.example .env
docker compose up --build
```

## Deploiement Render

Le projet est pret pour un deploiement Docker sur Render avec le manifest [`render.yaml`](./render.yaml).

### Variables Render importantes

- `APP_KEY` : genere automatiquement via `render.yaml`
- `APP_ENV=production`
- `APP_DEBUG=false`
- `APP_URL` : injecte depuis l'URL du service Render
- `L5_SWAGGER_CONST_HOST` : injecte depuis l'URL du service Render
- `CORS_ALLOWED_ORIGINS` : domaine du frontend autorise, par exemple `https://projet-car-express.vercel.app`
- `SANCTUM_STATEFUL_DOMAINS` : domaine frontend pour les flux SPA si necessaire
- `DB_*` : injectees depuis la base PostgreSQL Render
- `DB_SSLMODE=require`

### Demarrage du conteneur

Au lancement, le conteneur :

- met en cache la configuration Laravel
- met en cache les routes et les vues
- execute `php artisan migrate --force`
- regenere Swagger
- expose l'application sur le port Render

### Checklist avant de deployer

- verifier que la base PostgreSQL Render est bien attachee au service
- verifier que `APP_KEY` est present
- verifier que le service ecoute bien sur `PORT`
- verifier que la route de sante `/up` repond
- verifier que Swagger est accessible sur `/api/documentation`

### Lien Swagger apres deploiement

```text
https://backendcarexpress.onrender.com/api/documentation
```

## PostgreSQL

Variables à renseigner dans `.env` :

```env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=carexpress
DB_USERNAME=postgres
DB_PASSWORD=postgres
L5_SWAGGER_CONST_HOST=http://localhost:8000
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:5174,http://127.0.0.1:5173,http://127.0.0.1:5174,https://projet-car-express.vercel.app
SANCTUM_STATEFUL_DOMAINS=localhost:5173,localhost:5174,127.0.0.1:5173,127.0.0.1:5174,projet-car-express.vercel.app
```

## Comptes de démonstration

- Admin: `admin@carexpress.sn` / `admin12345`
- Client: `client@carexpress.sn` / `client12345`
- Agence: `agency+dakar-auto-services@carexpress.sn` / `agency12345`

## Base API

Toutes les routes sont préfixées par `/api/v1`.

## Endpoints publics

Les endpoints publics de consultation ont ete renommes pour etre plus explicites :

- `POST /api/v1/authentification/client/inscription` : inscription client compatible avec le formulaire front
- `POST /api/v1/authentification/client/connexion` : connexion dediee client
- `POST /api/v1/authentification/agence/inscription` : inscription agence depuis le formulaire partenaire
- `POST /api/v1/authentification/agence/connexion` : connexion dediee agence
- `POST /api/v1/authentification/superadmin/connexion` : connexion dediee superadmin
- `GET /api/v1/authentification/utilisateur-connecte` : recupere l'utilisateur actuellement authentifie
- `GET /api/v1/catalogue/agences` : liste des agences visibles dans le catalogue public
- `GET /api/v1/catalogue/agences/{slug}` : detail d'une agence publique
- `GET /api/v1/catalogue/vehicules` : liste des vehicules du catalogue public
- `GET /api/v1/catalogue/vehicules/{vehicle}` : detail d'un vehicule
- `GET /api/v1/catalogue/vehicules/{vehicle}/verifier-disponibilite` : verification de disponibilite d'un vehicule sur une periode
- `GET /api/v1/catalogue/vehicules/filtres` : donnees de filtres pour le catalogue, par exemple marques, categories, villes et types d'annonce

Ces noms remplacent les anciennes routes plus vagues de type `vehicules`, `agences` et `metadonnees`.

## Format de reponse API

Succes :

```json
{
  "status": true,
  "message": "Texte informatif",
  "data": {}
}
```

Erreur :

```json
{
  "status": false,
  "message": "Texte d'erreur",
  "errors": {
    "field": [
      "message de validation"
    ]
  }
}
```

## Verification effectuee

- `php artisan config:cache` : OK
- `php artisan route:cache` : OK
- `php artisan view:cache` : OK
- `php artisan l5-swagger:generate` : OK

La seule verification non finalisee localement est la connexion PostgreSQL, car aucune base Render n'est accessible depuis cet environnement local.
