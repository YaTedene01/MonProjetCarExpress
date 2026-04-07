<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserRole
{
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = $request->user();

        if (! $user) {
            throw new AuthenticationException('Authentification requise ou jeton invalide.');
        }

        if (! in_array($user->role->value ?? $user->role, $roles, true)) {
            abort(Response::HTTP_FORBIDDEN, 'You are not allowed to access this resource.');
        }

        return $next($request);
    }
}
