# CarExpress

Application React/Vite de démonstration pour la location, l'achat et l'administration d'une plateforme automobile multi-rôles.

Le projet contient un front-end complet avec parcours `client`, `agence` et `super admin`, prêt à être lancé localement, buildé et servi statiquement.

## Aperçu

CarExpress propose actuellement :

- une landing page et une sélection de rôles
- un espace client avec recherche, réservation, achat, messagerie et profil interactif
- un espace agence avec gestion des annonces, messagerie, profil interactif et édition des véhicules
- un espace admin avec enregistrement d'agences, supervision, gestion d'agences et vues détaillées
- des formulaires de paiement plus réalistes pour `Mobile Money`, `carte bancaire` et `cash` côté location

## Stack

- React 18
- Vite
- CSS inline + styles globaux
- Docker + Nginx pour le build/serve statique

## Fonctionnalités principales

### Espace client

- recherche de véhicules en location et en vente
- fiche détail véhicule avec réservation / achat
- choix de paiement avec sous-options `Wave` ou `Orange Money`
- messagerie client ↔ agence
- profil client avec rubriques cliquables

### Espace agence

- connexion et inscription agence
- création, modification et suppression d'annonces
- gestion des annonces en tableau
- messagerie agence ↔ client
- profil agence avec sections cliquables

### Espace admin

- tableau de bord de supervision
- enregistrement d'une nouvelle agence
- validation et suspension d'agences avec annulation possible
- bouton `Voir` ouvrant le profil agence et ses véhicules
- profil administrateur interactif

## Démarrage rapide

```bash
cd carexpress-react
npm install
npm run dev
```

Application disponible par défaut sur `http://localhost:5173`.

## Build production

```bash
npm run build
```

## Scripts utiles

```bash
npm run dev
npm run build
npm run preview
```

## Structure utile

- `src/pages/ClientApp.jsx` : espace client
- `src/pages/AgencyApp.jsx` : espace agence
- `src/pages/AdminApp.jsx` : espace super admin
- `src/components/VehicleDetail.jsx` : détails véhicule, paiements, profils agence
- `src/components/EnhancedAuthForm.jsx` : formulaires d'authentification et d'inscription
- `src/components/ChatPanel.jsx` : messagerie partagée
- `src/hooks/useAppState.js` : état global de l'application

## Docker

Build image :

```bash
docker build -t carexpress-react:latest .
```

Lancer le conteneur :

```bash
docker run --rm -p 8080:80 carexpress-react:latest
```

Docker Compose production :

```bash
docker-compose up --build -d
```

Docker Compose développement :

```bash
docker-compose -f docker-compose.dev.yml up
```

## Notes

- `nginx.conf` contient la configuration SPA avec `try_files`
- le projet est aujourd'hui un front-end prototype sans backend persistant
- certaines données sont locales/in-memory pour simuler les flux métier

## Documentation complémentaire

- `QUICKSTART.md`
- `README_DESIGN.md`
- `DESIGN_SYSTEM.md`
- `DEVELOPMENT.md`
- `SNIPPETS.md`
- `SUMMARY.md`

## Contribuer

- créer une branche feature
- garder la structure `src/components`, `src/pages`, `src/hooks`, `src/services`
- vérifier le build avec `npm run build`

## Licence

Ajoutez un fichier `LICENSE` si vous souhaitez préciser la licence du projet.

---

Version: 1.1.0 — Dernière mise à jour: Avril 2026
