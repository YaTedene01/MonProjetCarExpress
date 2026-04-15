<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\AgencyRegisterRequest;
use App\Http\Requests\Auth\ClientRegisterRequest;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Resources\AgencyResource;
use App\Http\Resources\UserResource;
use App\Services\AuthService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use OpenApi\Attributes as OA;
use Throwable;

class AuthController extends Controller
{
    public function __construct(
        private readonly AuthService $authService
    ) {}

    #[OA\Post(
        path: '/api/v1/authentification/client/inscription',
        tags: ['Authentification'],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ['name', 'email', 'phone', 'city', 'password', 'password_confirmation'],
                properties: [
                    new OA\Property(property: 'name', type: 'string', example: 'Moussa Ndiaye'),
                    new OA\Property(property: 'email', type: 'string', format: 'email', example: 'moussa@carexpress.sn'),
                    new OA\Property(property: 'phone', type: 'string', example: '+221771234567'),
                    new OA\Property(property: 'city', type: 'string', example: 'Dakar'),
                    new OA\Property(property: 'password', type: 'string', format: 'password', example: 'client12345'),
                    new OA\Property(property: 'password_confirmation', type: 'string', format: 'password', example: 'client12345'),
                    new OA\Property(property: 'device_name', type: 'string', example: 'client-web')
                ]
            )
        ),
        responses: [
            new OA\Response(
                response: 201,
                description: 'Compte client cree',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'status', type: 'boolean', example: true),
                        new OA\Property(property: 'message', type: 'string', example: 'Compte client cree avec succes.'),
                        new OA\Property(
                            property: 'data',
                            properties: [
                                new OA\Property(property: 'token', type: 'string', example: '1|zXc123tokenvalue'),
                                new OA\Property(property: 'token_type', type: 'string', example: 'Bearer'),
                                new OA\Property(
                                    property: 'utilisateur',
                                    properties: [
                                        new OA\Property(property: 'id', type: 'integer', example: 15),
                                        new OA\Property(property: 'name', type: 'string', example: 'Moussa Ndiaye'),
                                        new OA\Property(property: 'email', type: 'string', format: 'email', example: 'moussa@carexpress.sn'),
                                        new OA\Property(property: 'phone', type: 'string', example: '+221771234567'),
                                        new OA\Property(property: 'city', type: 'string', example: 'Dakar'),
                                        new OA\Property(property: 'role', type: 'string', example: 'client')
                                    ],
                                    type: 'object'
                                )
                            ],
                            type: 'object'
                        )
                    ],
                    type: 'object'
                )
            ),
            new OA\Response(
                response: 422,
                description: 'Erreur de validation',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'status', type: 'boolean', example: false),
                        new OA\Property(property: 'message', type: 'string', example: 'Les donnees fournies sont invalides.'),
                        new OA\Property(
                            property: 'errors',
                            properties: [
                                new OA\Property(
                                    property: 'email',
                                    type: 'array',
                                    items: new OA\Items(type: 'string', example: 'Cette adresse email est deja utilisee.')
                                ),
                                new OA\Property(
                                    property: 'password',
                                    type: 'array',
                                    items: new OA\Items(type: 'string', example: 'La confirmation du mot de passe ne correspond pas.')
                                )
                            ],
                            type: 'object'
                        )
                    ],
                    type: 'object'
                )
            )
        ]
    )]
    public function registerClient(ClientRegisterRequest $request): JsonResponse
    {
        $resultat = $this->authService->inscrireClient([
            ...$request->validated(),
            'device_name' => $request->input('device_name', 'client-web'),
        ]);

        return $this->successResponse('Compte client créé avec succès.', [
            'token' => $resultat['token'],
            'token_type' => 'Bearer',
            'utilisateur' => new UserResource($resultat['utilisateur']),
        ], 201);
    }

    #[OA\Post(
        path: '/api/v1/authentification/agence/inscription',
        tags: ['Authentification'],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ['company', 'phone', 'email', 'city', 'password', 'password_confirmation'],
                properties: [
                    new OA\Property(property: 'company', type: 'string', example: 'Dakar Auto Services'),
                    new OA\Property(property: 'phone', type: 'string', example: '+221771234567'),
                    new OA\Property(property: 'email', type: 'string', format: 'email', example: 'contact@dakar-auto.sn'),
                    new OA\Property(property: 'city', type: 'string', example: 'Dakar'),
                    new OA\Property(property: 'activity', type: 'string', example: 'Location et vente'),
                    new OA\Property(property: 'password', type: 'string', format: 'password', example: 'agency12345'),
                    new OA\Property(property: 'password_confirmation', type: 'string', format: 'password', example: 'agency12345'),
                    new OA\Property(property: 'device_name', type: 'string', example: 'agency-web')
                ]
            )
        ),
        responses: [
            new OA\Response(response: 201, description: 'Compte agence cree'),
            new OA\Response(response: 422, description: 'Erreur de validation')
        ]
    )]
    public function registerAgency(AgencyRegisterRequest $request): JsonResponse
    {
        $resultat = $this->authService->inscrireAgence([
            ...$request->validated(),
            'device_name' => $request->input('device_name', 'agency-web'),
        ]);

        return $this->successResponse('Compte agence créé avec succès.', [
            'token' => $resultat['token'],
            'token_type' => 'Bearer',
            'utilisateur' => new UserResource($resultat['utilisateur']),
            'agence' => new AgencyResource($resultat['agence']),
        ], 201);
    }

    #[OA\Post(
        path: '/api/v1/authentification/client/connexion',
        tags: ['Authentification'],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ['identifier', 'password'],
                properties: [
                    new OA\Property(property: 'identifier', type: 'string', example: 'client@carexpress.sn'),
                    new OA\Property(property: 'password', type: 'string', format: 'password', example: 'client12345'),
                    new OA\Property(property: 'device_name', type: 'string', example: 'client-web')
                ]
            )
        ),
        responses: [
            new OA\Response(response: 200, description: 'Connexion client reussie'),
            new OA\Response(response: 422, description: 'Erreur de validation ou identifiants invalides')
        ]
    )]
    public function loginClient(LoginRequest $request): JsonResponse
    {
        return $this->executeLogin($request, 'client', 'client-web');
    }

    #[OA\Post(
        path: '/api/v1/authentification/agence/connexion',
        tags: ['Authentification'],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ['identifier', 'password'],
                properties: [
                    new OA\Property(property: 'identifier', type: 'string', example: 'agency+dakar-auto-services@carexpress.sn'),
                    new OA\Property(property: 'password', type: 'string', format: 'password', example: 'agency12345'),
                    new OA\Property(property: 'device_name', type: 'string', example: 'agency-web')
                ]
            )
        ),
        responses: [
            new OA\Response(response: 200, description: 'Connexion agence reussie'),
            new OA\Response(response: 422, description: 'Erreur de validation ou identifiants invalides')
        ]
    )]
    public function loginAgency(LoginRequest $request): JsonResponse
    {
        return $this->executeLogin($request, 'agency', 'agency-web');
    }

    #[OA\Post(
        path: '/api/v1/authentification/superadmin/connexion',
        tags: ['Authentification'],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ['identifier', 'password'],
                properties: [
                    new OA\Property(property: 'identifier', type: 'string', example: 'admin@carexpress.sn'),
                    new OA\Property(property: 'password', type: 'string', format: 'password', example: 'admin12345'),
                    new OA\Property(property: 'device_name', type: 'string', example: 'admin-web')
                ]
            )
        ),
        responses: [
            new OA\Response(response: 200, description: 'Connexion superadmin reussie'),
            new OA\Response(response: 422, description: 'Erreur de validation ou identifiants invalides')
        ]
    )]
    public function loginSuperAdmin(LoginRequest $request): JsonResponse
    {
        return $this->executeLogin($request, 'admin', 'admin-web');
    }

    #[OA\Get(
        path: '/api/v1/authentification/utilisateur-connecte',
        tags: ['Authentification'],
        security: [['sanctum' => []]],
        responses: [
            new OA\Response(
                response: 200,
                description: 'Utilisateur courant recupere',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'status', type: 'boolean', example: true),
                        new OA\Property(property: 'message', type: 'string', example: 'Utilisateur recupere avec succes.'),
                        new OA\Property(
                            property: 'data',
                            properties: [
                                new OA\Property(property: 'id', type: 'integer', example: 7),
                                new OA\Property(property: 'name', type: 'string', example: 'Client Demo'),
                                new OA\Property(property: 'email', type: 'string', format: 'email', example: 'client@carexpress.sn'),
                                new OA\Property(property: 'phone', type: 'string', example: '+221770000000'),
                                new OA\Property(property: 'city', type: 'string', example: 'Dakar'),
                                new OA\Property(property: 'role', type: 'string', example: 'client')
                            ],
                            type: 'object'
                        )
                    ],
                    type: 'object'
                )
            ),
            new OA\Response(
                response: 401,
                description: 'Token manquant ou invalide',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'status', type: 'boolean', example: false),
                        new OA\Property(property: 'message', type: 'string', example: 'Authentification requise ou jeton invalide.')
                    ],
                    type: 'object'
                )
            )
        ]
    )]
    public function authenticatedUser(Request $request): JsonResponse
    {
        $user = $request->user();

        try {
            $user = $user->load('agency');
        } catch (Throwable) {
            // Keep response available even if agency relationship data is inconsistent.
        }

        return $this->successResponse(
            'Utilisateur recupere avec succes.',
            new UserResource($user)
        );
    }

    #[OA\Post(
        path: '/api/v1/authentification/deconnexion',
        tags: ['Authentification'],
        security: [['sanctum' => []]],
        responses: [
            new OA\Response(
                response: 200,
                description: 'Deconnexion reussie',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'status', type: 'boolean', example: true),
                        new OA\Property(property: 'message', type: 'string', example: 'Deconnexion reussie.'),
                        new OA\Property(property: 'data', type: 'null', nullable: true, example: null)
                    ],
                    type: 'object'
                )
            ),
            new OA\Response(
                response: 401,
                description: 'Token manquant ou invalide',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'status', type: 'boolean', example: false),
                        new OA\Property(property: 'message', type: 'string', example: 'Authentification requise ou jeton invalide.')
                    ],
                    type: 'object'
                )
            )
        ]
    )]
    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()?->delete();

        return $this->successResponse('Déconnexion réussie.');
    }

    private function executeLogin(LoginRequest $request, string $forcedRole, string $defaultDeviceName = 'web-app'): JsonResponse
    {
        $validated = $request->validated();

        $resultat = $this->authService->connecter([
            ...$validated,
            'role' => $forcedRole,
            'device_name' => $request->input('device_name', $defaultDeviceName),
        ]);

        return $this->successResponse('Connexion réussie.', [
            'token' => $resultat['token'],
            'token_type' => 'Bearer',
            'utilisateur' => new UserResource($resultat['utilisateur']),
        ]);
    }
}
