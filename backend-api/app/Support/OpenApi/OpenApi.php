<?php

namespace App\Support\OpenApi;

use OpenApi\Attributes as OA;

#[OA\Info(
    version: '1.0.0',
    title: 'Car Express API',
    description: 'API Laravel professionnelle pour Car Express.'
)]
#[OA\Server(
    url: L5_SWAGGER_CONST_HOST,
    description: 'Serveur API'
)]
#[OA\SecurityScheme(
    securityScheme: 'sanctum',
    type: 'http',
    scheme: 'bearer',
    bearerFormat: 'Bearer'
)]
#[OA\Schema(
    schema: 'UnauthorizedResponse',
    properties: [
        new OA\Property(property: 'status', type: 'boolean', example: false),
        new OA\Property(property: 'message', type: 'string', example: 'Authentification requise ou jeton invalide.')
    ],
    type: 'object'
)]
#[OA\Schema(
    schema: 'ForbiddenResponse',
    properties: [
        new OA\Property(property: 'status', type: 'boolean', example: false),
        new OA\Property(property: 'message', type: 'string', example: 'Vous n avez pas les droits suffisants pour cette action.')
    ],
    type: 'object'
)]
#[OA\Schema(
    schema: 'NotFoundResponse',
    properties: [
        new OA\Property(property: 'status', type: 'boolean', example: false),
        new OA\Property(property: 'message', type: 'string', example: 'Ressource introuvable.')
    ],
    type: 'object'
)]
#[OA\Schema(
    schema: 'ServerErrorResponse',
    properties: [
        new OA\Property(property: 'status', type: 'boolean', example: false),
        new OA\Property(property: 'message', type: 'string', example: 'Une erreur serveur est survenue.')
    ],
    type: 'object'
)]
#[OA\Schema(
    schema: 'ValidationErrorResponse',
    properties: [
        new OA\Property(property: 'status', type: 'boolean', example: false),
        new OA\Property(property: 'message', type: 'string', example: 'Les donnees fournies sont invalides.'),
        new OA\Property(
            property: 'errors',
            type: 'object',
            additionalProperties: new OA\AdditionalProperties(
                type: 'array',
                items: new OA\Items(type: 'string', example: 'Le champ est obligatoire.')
            )
        )
    ],
    type: 'object'
)]
#[OA\Tag(name: 'Public')]
#[OA\Tag(name: 'Authentification')]
#[OA\Tag(name: 'Client')]
#[OA\Tag(name: 'Agence')]
#[OA\Tag(name: 'Administration')]
class OpenApi {}
