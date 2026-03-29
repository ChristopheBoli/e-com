<?php

namespace App\Services\Admin;

use App\Models\User;
use Illuminate\Http\JsonResponse;

class UsersService
{
    public function list()
    {
        // Données simulées pour les utilisateurs
        return [
            'users' => [
                [
                    'id' => 1,
                    'name' => 'Admin Test',
                    'email' => 'admin@exemple.com',
                    'role' => 'admin',
                    'created_at' => '2026-03-15 10:15:00',
                    'updated_at' => '2026-03-15 12:00:00',
                ],
                [
                    'id' => 2,
                    'message' => 'Utilisateur',
                    'name' => 'Client Test',
                    'email' => 'client@exemple.com',
                    'role' => 'client',
                    'created_at' => '2026-03-20 10:15:00',
                    'updated_at' => '2026-03-20 10:00:00',
                ],
                [
                    'id' => 3,
                    'message' => 'Utilisateur',
                    'name' => 'Client Test 2',
                    'email' => 'client2@exemple.com',
                    'role' => 'client',
                    'created_at' => '2026-03-25 10:15:00',
                    'updated_at' => '2026-03-25 10:15:00',
                ],
            ],
        'total' => 3,
            ];
    }
}
