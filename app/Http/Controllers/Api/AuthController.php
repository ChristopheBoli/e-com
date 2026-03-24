<?php

namespace App\Http\Controllers\Api;

use App\Exceptions\AuthException;
use App\Http\Controllers\Api\Concerns\ApiResponse;
use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Services\AuthService;
use Illuminate\Http\JsonResponse;
use Throwable;

class AuthController extends Controller
{
    use ApiResponse;

    public function __construct(
        private readonly AuthService $authService,
    ) {
    }

    public function register(RegisterRequest $request): JsonResponse
    {
        $payload = $this->authService->register($request->validated());

        return $this->success($payload, 'Inscription réussie.', 201);
    }

    public function login(LoginRequest $request): JsonResponse
    {
        try {
            $payload = $this->authService->login($request->validated());

            return $this->success($payload, 'Connexion réussie.');
        } catch (AuthException $exception) {
            return $this->error($exception->getMessage(), null, 401);
        }
    }

    public function me(): JsonResponse
    {
        $user = auth('api')->user();

        if (! $user) {
            return $this->error('Utilisateur non authentifié.', null, 401);
        }

        return $this->success($this->authService->me((int) $user->id), 'Profil récupéré.');
    }

    public function logout(): JsonResponse
    {
        try {
            $this->authService->logout();

            return $this->success(null, 'Déconnexion réussie.');
        } catch (Throwable) {
            return $this->error('Impossible de se déconnecter.', null, 400);
        }
    }
}
