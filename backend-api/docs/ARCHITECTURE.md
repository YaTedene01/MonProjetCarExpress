# Architecture Car Express API

## Dossiers principaux

- `app/Http/Controllers/Api` : points d'entrée HTTP
- `app/Http/Kernel.php` : structure HTTP visible dans l'architecture
- `app/Http/Requests` : validation des requêtes
- `app/Http/Resources` : sérialisation JSON
- `app/Console` : commandes artisan du projet
- `app/Exceptions` : exceptions applicatives
- `app/Jobs` : traitements asynchrones / queue
- `app/Repository` : accès aux données Eloquent
- `app/Services` : logique métier
- `app/Traits` : réponses API standardisées
- `app/Utils` : génération de références et helpers
- `app/Models` : modèles Eloquent
- `app/Support/OpenApi` : source Swagger/OpenAPI
- `backups` : emplacement réservé aux exports et sauvegardes locales
- `database/migrations` : schéma PostgreSQL
- `database/seeders` : données de démarrage
- `docs/swagger.json` : export local de la documentation OpenAPI

## Fichiers cles

| Fichier | Role |
|---------|------|
| `routes/api.php` | Definition endpoints |
| `app/Http/Controllers/Api/*` | Controleurs et orchestration HTTP |
| `app/Services/*` | Logique metier |
| `app/Repository/*` | Acces aux donnees |
| `app/Models/*` | Modeles ORM Eloquent |
| `database/migrations/*` | Schema base de donnees |
| `docs/swagger.json` | Documentation OpenAPI exportee |
| `.env.example` | Configuration d'exemple |
| `Dockerfile` | Image Docker applicative |
| `docker-compose.yml` | Stack locale app + PostgreSQL |
| `render.yaml` | Deploiement Render |

## Flux recommandé

`Controller -> Request -> Service -> Repository -> Model -> Resource`

## Réponses API

Le projet utilise le trait `ApiResponse` pour standardiser les réponses :

```json
{
  "status": true,
  "message": "Operation reussie.",
  "data": {}
}
```

En cas d'erreur :

```json
{
  "status": false,
  "message": "Une erreur est survenue.",
  "errors": {
    "field": [
      "message de validation"
    ]
  }
}
```

## Couche métier actuelle

- `AuthService` : inscription et connexion
- `AgenceService` : création d'agence côté administration
- `VehiculeService` : création, mise à jour et disponibilité véhicule
- `ReservationService` : création réservation + paiement
- `DemandeAchatService` : création demande d'achat + frais de service
