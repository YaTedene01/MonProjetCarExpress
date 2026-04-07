# Déploiement Docker complet (Frontend + Backend + PostgreSQL)

Ce dépôt contient maintenant une orchestration Docker unifiée à la racine:

- `docker-compose.yml`
- `deploy/nginx/default.conf`
- `.env.docker.example`

## 1) Préparer les variables

Depuis la racine:

```bash
cp .env.docker.example .env
```

Éditez ensuite `.env` :

- `APP_URL` : URL publique (ex: `https://app.mondomaine.com`)
- `APP_KEY` : clé Laravel (optionnel si vide, le conteneur tente de la générer)
- `POSTGRES_*` : credentials base de données
- `CORS_ALLOWED_ORIGINS` / `SANCTUM_STATEFUL_DOMAINS` : domaine frontend

## 2) Lancer en local

```bash
docker compose up -d --build
```

Accès:

- Frontend: `http://localhost`
- API: `http://localhost/api/v1/...`
- Healthcheck: `http://localhost/up`
- Swagger: `http://localhost/api/documentation`

Logs:

```bash
docker compose logs -f
```

## 3) Déployer sur un VPS

Sur le serveur:

```bash
git clone <votre-repo>
cd MonProjetCarExpress
cp .env.docker.example .env
# éditez .env avec vos vraies valeurs
docker compose up -d --build
```

## 4) HTTPS (recommandé)

Ce compose expose HTTP sur le port `80` via le service `gateway`.

Pour HTTPS:

- placez un reverse-proxy TLS devant (`Nginx Proxy Manager`, `Traefik`, `Caddy`, ou Nginx + Certbot),
- ou adaptez `deploy/nginx/default.conf` pour gérer TLS.

## 5) Commandes utiles

Redéployer après changement:

```bash
docker compose up -d --build
```

Relancer uniquement backend:

```bash
docker compose up -d --build backend
```

Migrations manuelles:

```bash
docker compose exec backend php artisan migrate --force
```

## Notes techniques

- Le `gateway` route:
  - `/api/*`, `/docs/*`, `/up` vers `backend`
  - le reste vers `frontend`
- Le backend applique les migrations au démarrage avec retry DB.
- Le frontend peut utiliser des appels same-origin (recommandé) avec `VITE_API_BASE_URL=` vide.
