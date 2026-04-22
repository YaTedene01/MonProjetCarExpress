# Déploiement, Versionning Et CI/CD

Ce document décrit la méthode de déploiement utilisée pour `CarExpress`, la stratégie de versionning retenue et l'intégration CI/CD mise en place dans le dépôt.

## 1. Objectif

Le déploiement avait pour objectif de :

- rendre l'application facile à lancer en local pour la démonstration
- garder la même logique entre environnement de développement et environnement de production
- automatiser les contrôles qualité avant livraison
- réduire les erreurs manuelles pendant la mise en ligne

La stratégie retenue repose sur :

- `Git` pour le versionning du code source
- `GitLab CI/CD` via le fichier [`.gitlab-ci.yml`](/home/ya-tedene/Téléchargements/MonProjetCarExpress/.gitlab-ci.yml)
- `Docker Compose` pour l'orchestration de la stack applicative
- `Nginx` comme point d'entrée HTTP
- `Laravel + PostgreSQL` pour le backend
- `React + Vite` pour le frontend

## 2. Architecture De Déploiement

La plateforme est organisée autour de quatre services principaux :

1. `db`
   PostgreSQL stocke les données métier.
2. `backend`
   Laravel expose les routes API, la logique métier et la documentation Swagger.
3. `frontend`
   React/Vite génère l'interface utilisateur.
4. `gateway`
   Nginx centralise l'accès HTTP et distribue les requêtes entre frontend et backend.

Schéma logique :

```text
Utilisateur
   |
   v
Nginx Gateway
   |----> Frontend React
   |
   \----> API Laravel ----> PostgreSQL
```

## 3. Étapes De Déploiement Utilisées

### 3.1 Préparation du serveur

Le serveur de déploiement doit disposer au minimum de :

- `Docker`
- `Docker Compose v2`
- un accès SSH pour les opérations automatiques

### 3.2 Récupération du code

```bash
git clone <url-du-projet>
cd MonProjetCarExpress
```

### 3.3 Préparation des variables d'environnement

```bash
cp .env.docker.example .env
```

Les variables importantes à adapter sont :

- `APP_URL`
- `POSTGRES_DB`
- `POSTGRES_USER`
- `POSTGRES_PASSWORD`
- `GATEWAY_PORT`
- `CORS_ALLOWED_ORIGINS`
- `SANCTUM_STATEFUL_DOMAINS`

### 3.4 Construction et démarrage des conteneurs

```bash
docker compose up -d --build
```

Cette commande :

- construit l'image du backend Laravel
- construit l'image du frontend React
- démarre PostgreSQL
- démarre Nginx comme passerelle d'accès

### 3.5 Initialisation de la base de données

```bash
docker compose exec backend php artisan migrate --force
docker compose exec backend php artisan db:seed --force
```

### 3.6 Vérification post-déploiement

Après démarrage, les vérifications effectuées sont :

- ouverture du frontend via `http://localhost`
- test d'un endpoint API via `/api/v1`
- test de la documentation Swagger via `/api/documentation`
- vérification de l'état des conteneurs

Commandes utiles :

```bash
docker compose ps
docker compose logs -f
docker compose exec backend php artisan test
```

## 4. Versionning Utilisé

Le projet utilise `Git` comme système de gestion de versions.

### 4.1 Rôle du versionning

Le versionning permet de :

- suivre l'historique complet des modifications
- revenir sur une version stable si nécessaire
- isoler les développements par fonctionnalité
- collaborer sans écraser les changements existants

### 4.2 Convention de branches proposée

Pour le mémoire et pour l'exploitation du projet, la convention suivante est recommandée :

- `main`
  branche stable, déployable
- `develop`
  branche d'intégration continue
- `feature/<nom>`
  nouvelle fonctionnalité
- `fix/<nom>`
  correction de bug
- `hotfix/<nom>`
  correction urgente sur une version de production

Exemples :

- `feature/messagerie-client-agence`
- `fix/validation-dates-location`
- `hotfix/publication-agence`

### 4.3 Versionnement applicatif

Pour les livraisons, une convention de type `SemVer` peut être utilisée :

- `v1.0.0` : première version stable
- `v1.1.0` : ajout de fonctionnalités
- `v1.1.1` : correctif mineur

Cette convention facilite :

- la traçabilité des livraisons
- la rédaction du mémoire
- la préparation d'un rollback

## 5. Intégration CI/CD Mise En Place

Le projet contient désormais une intégration `GitLab CI/CD` complète via [`.gitlab-ci.yml`](/home/ya-tedene/Téléchargements/MonProjetCarExpress/.gitlab-ci.yml).

### 5.1 Objectif de la CI/CD

L'intégration continue et le déploiement continu servent à :

- automatiser les contrôles qualité
- détecter rapidement les erreurs backend et frontend
- construire les images Docker de validation
- préparer un déploiement plus fiable sur la branche principale

### 5.2 Stages du pipeline

Le pipeline est structuré en quatre stages :

1. `quality`
   contrôle qualité backend
2. `test`
   exécution des tests Laravel avec PostgreSQL
3. `build`
   build frontend React et build des images Docker
4. `deploy`
   déploiement manuel vers la production depuis `main`

### 5.3 Jobs configurés

#### `backend:quality`

Ce job :

- installe les dépendances PHP
- exécute `Laravel Pint` en mode vérification

Commande principale :

```bash
vendor/bin/pint --test
```

#### `backend:test`

Ce job :

- démarre un service PostgreSQL pour la CI
- prépare le fichier `.env`
- exécute les migrations
- lance les tests backend

Commande principale :

```bash
php artisan test
```

#### `frontend:build`

Ce job :

- installe les dépendances Node.js
- compile l'application React

Commande principale :

```bash
npm run build
```

#### `docker:build`

Ce job :

- construit l'image Docker du backend
- construit l'image Docker du frontend

Il permet de vérifier que les Dockerfiles restent valides.

#### `deploy:production`

Ce job :

- s'exécute uniquement sur `main`
- reste manuel pour garder la main sur la mise en production
- envoie le dépôt sur le serveur via `rsync`
- relance la stack avec `docker compose up -d --build`

### 5.4 Variables CI/CD nécessaires

Pour le déploiement, les variables suivantes doivent être définies dans GitLab :

- `DEPLOY_HOST`
- `DEPLOY_USER`
- `DEPLOY_PATH`
- `DEPLOY_SSH_PRIVATE_KEY`

Sans ces variables, le job de déploiement ne s'exécute pas.

## 6. Exemple De Cycle Complet

Un cycle de livraison typique suit les étapes suivantes :

1. création d'une branche `feature/...`
2. développement et commits locaux
3. push vers le dépôt distant
4. lancement automatique du pipeline CI
5. correction des erreurs détectées
6. fusion dans `main`
7. lancement manuel du job `deploy:production`

## 7. Intérêt Pour Le Mémoire

Dans le mémoire, cette approche permet de montrer que le projet ne se limite pas au développement fonctionnel. Elle prouve aussi que :

- le projet suit une logique d'industrialisation
- la qualité est contrôlée automatiquement
- le déploiement est reproductible
- le versionning facilite la maintenance et l'évolution

## 8. Limites Et Améliorations Possibles

Les améliorations possibles pour une version plus avancée sont :

- ajout de tests frontend automatisés
- publication des images Docker dans un registre
- déploiement automatique vers un serveur de préproduction
- stratégie de rollback automatisée
- supervision avec monitoring et alerting

## 9. Commandes Résumées

### Déploiement local

```bash
cp .env.docker.example .env
docker compose up -d --build
docker compose exec backend php artisan migrate --force
docker compose exec backend php artisan db:seed --force
```

### Vérifications

```bash
docker compose ps
docker compose logs -f
docker compose exec backend php artisan test
cd carexpress-react && npm run build
```

### Versionning

```bash
git checkout -b feature/nom-fonctionnalite
git add .
git commit -m "feat: description du changement"
git push origin feature/nom-fonctionnalite
```
