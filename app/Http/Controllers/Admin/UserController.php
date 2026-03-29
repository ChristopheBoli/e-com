<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\JsonResponse;

class UserController extends Controller
{
    public function index()
    {
        return new JsonResponse([
            'message' => 'Endpoint admin/users créé',
            'users' => [
                [
                    'id' => 1,
                    'name' => 'Admin Test',
                    'email' => 'admin@exemple.com',
                    'role' => 'admin',
                    'created_at' => '2026-03-15 10:15:00',
                    'updated_at' => '2026-03-15 12:00:00',
                ],
                ],
        ], 200);
    }
}
