<?php

namespace Tests\Feature\Api;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPOpenSourceSaver\JWTAuth\Facades\JWTAuth;
use Tests\TestCase;

class AdminAccessTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_endpoint_rejects_non_admin_user(): void
    {
        $user = User::factory()->create([
            'role' => User::ROLE_USER,
        ]);

        $token = JWTAuth::fromUser($user);

        $response = $this->withHeader('Authorization', "Bearer {$token}")
            ->getJson('/api/admin/products');

        $response->assertStatus(403)
            ->assertJsonPath('success', false);
    }

    public function test_admin_endpoint_allows_admin_user(): void
    {
        $admin = User::factory()->admin()->create();
        $token = JWTAuth::fromUser($admin);

        $response = $this->withHeader('Authorization', "Bearer {$token}")
            ->getJson('/api/admin/products');

        $response->assertStatus(200)
            ->assertJsonPath('success', true);
    }
}
