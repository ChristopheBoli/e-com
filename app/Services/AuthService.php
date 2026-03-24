<?php

namespace App\Services;

use App\Exceptions\AuthException;
use App\Models\User;
use App\Repositories\Contracts\UserRepositoryInterface;
use Illuminate\Support\Facades\Hash;
use PHPOpenSourceSaver\JWTAuth\Facades\JWTAuth;

class AuthService
{
    public function __construct(
        private readonly UserRepositoryInterface $users,
    ) {
    }

    public function register(array $data): array
    {
        $user = $this->users->create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => $data['password'],
            'role' => User::ROLE_USER,
        ]);

        $token = JWTAuth::fromUser($user);

        return [
            'user' => $this->transformUser($user),
            'token' => $token,
            'token_type' => 'bearer',
        ];
    }

    public function login(array $credentials): array
    {
        $user = $this->users->findByEmail($credentials['email']);

        if (! $user || ! Hash::check($credentials['password'], $user->password)) {
            throw new AuthException('Email ou mot de passe invalide.');
        }

        $token = JWTAuth::fromUser($user);

        return [
            'user' => $this->transformUser($user),
            'token' => $token,
            'token_type' => 'bearer',
        ];
    }

    /**
     * @return array<string, mixed>|null
     */
    public function me(int $userId): ?array
    {
        $user = $this->users->findById($userId);

        if (! $user) {
            return null;
        }

        return $this->transformUser($user);
    }

    public function logout(): void
    {
        $token = JWTAuth::getToken();

        if ($token) {
            JWTAuth::invalidate($token);
        }
    }

    /**
     * @return array<string, mixed>
     */
    private function transformUser(User $user): array
    {
        return [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'role' => $user->role,
            'created_at' => $user->created_at,
            'updated_at' => $user->updated_at,
        ];
    }
}
