<?php

use App\Exceptions\ApiException;
use App\Http\Middleware\ForceJsonResponse;
use App\Http\Middleware\EnsureUserRole;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        api: __DIR__.'/../routes/api.php',
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->trustProxies(at: '*');
        $middleware->redirectGuestsTo(fn (Request $request) => $request->is('api/*') ? null : '/');
        $middleware->appendToGroup('api', [
            ForceJsonResponse::class,
        ]);

        $middleware->alias([
            'role' => EnsureUserRole::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->render(function (ApiException $exception, Request $request) {
            if (! $request->is('api/*')) {
                return null;
            }

            $payload = [
                'status' => false,
                'message' => $exception->getMessage(),
            ];

            if ($exception->errors() !== []) {
                $payload['errors'] = $exception->errors();
            }

            return response()->json($payload, $exception->statusCode());
        });

        $exceptions->render(function (ValidationException $exception, Request $request) {
            if (! $request->is('api/*')) {
                return null;
            }

            return response()->json([
                'status' => false,
                'message' => 'Les donnees fournies sont invalides.',
                'errors' => $exception->errors(),
            ], 422);
        });

        $exceptions->render(function (AuthenticationException $exception, Request $request) {
            if (! $request->is('api/*')) {
                return null;
            }

            return response()->json([
                'status' => false,
                'message' => 'Authentification requise ou jeton invalide.',
            ], 401);
        });

        $exceptions->render(function (AuthorizationException $exception, Request $request) {
            if (! $request->is('api/*')) {
                return null;
            }

            return response()->json([
                'status' => false,
                'message' => $exception->getMessage() ?: 'Vous n avez pas les droits suffisants pour cette action.',
            ], 403);
        });

        $exceptions->render(function (NotFoundHttpException $exception, Request $request) {
            if (! $request->is('api/*')) {
                return null;
            }

            return response()->json([
                'status' => false,
                'message' => 'Ressource introuvable.',
            ], 404);
        });

        $exceptions->render(function (\Throwable $exception, Request $request) {
            if (! $request->is('api/*')) {
                return null;
            }

            if ($exception instanceof HttpExceptionInterface) {
                return response()->json([
                    'status' => false,
                    'message' => $exception->getMessage() ?: 'Une erreur HTTP est survenue.',
                ], $exception->getStatusCode());
            }

            return response()->json([
                'status' => false,
                'message' => 'Une erreur serveur est survenue.',
            ], 500);
        });
    })->create();
