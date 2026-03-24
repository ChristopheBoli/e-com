<?php

namespace Tests\Feature\Api;

use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPOpenSourceSaver\JWTAuth\Facades\JWTAuth;
use Tests\TestCase;

class CartCheckoutFlowTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_user_can_complete_cart_to_checkout_flow(): void
    {
        $user = User::factory()->create();
        $product = Product::factory()->create([
            'price_cents' => 4500,
            'stock_quantity' => 10,
            'is_active' => true,
        ]);

        $token = JWTAuth::fromUser($user);

        $addResponse = $this->withHeader('Authorization', "Bearer {$token}")
            ->postJson('/api/cart/items', [
                'product_id' => $product->id,
                'quantity' => 2,
            ]);

        $addResponse->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.total_cents', 9000);

        $checkoutResponse = $this->withHeader('Authorization', "Bearer {$token}")
            ->postJson('/api/checkout');

        $checkoutResponse->assertStatus(201)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.total_cents', 9000);

        $cartAfterCheckout = $this->withHeader('Authorization', "Bearer {$token}")
            ->getJson('/api/cart');

        $cartAfterCheckout->assertStatus(200)
            ->assertJsonPath('data.total_cents', 0)
            ->assertJsonCount(0, 'data.items');
    }
}
