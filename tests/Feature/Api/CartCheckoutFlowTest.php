<?php

namespace Tests\Feature\Api;

use App\Models\Cart;
use App\Models\Order;
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
            ->assertJsonPath('data.total_cents', 9000)
            ->assertJsonPath('data.status', Order::STATUS_PAID);

        $cartAfterCheckout = $this->withHeader('Authorization', "Bearer {$token}")
            ->getJson('/api/cart');

        $cartAfterCheckout->assertStatus(200)
            ->assertJsonPath('data.total_cents', 0)
            ->assertJsonCount(0, 'data.items');

        $this->assertDatabaseHas('carts', [
            'user_id' => $user->id,
            'status' => Cart::STATUS_COMPLETED,
        ]);

        $this->assertDatabaseHas('carts', [
            'user_id' => $user->id,
            'status' => Cart::STATUS_ACTIVE,
        ]);
    }

    public function test_cart_alias_endpoints_work_with_documented_routes(): void
    {
        $user = User::factory()->create();
        $product = Product::factory()->create([
            'price_cents' => 2500,
            'stock_quantity' => 20,
            'is_active' => true,
        ]);

        $token = JWTAuth::fromUser($user);

        $add = $this->withHeader('Authorization', "Bearer {$token}")
            ->postJson('/api/cart/add', [
                'product_id' => $product->id,
                'quantity' => 3,
            ]);

        $add->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.total_cents', 7500);

        $update = $this->withHeader('Authorization', "Bearer {$token}")
            ->putJson('/api/cart/update', [
                'product_id' => $product->id,
                'quantity' => 1,
            ]);

        $update->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.total_cents', 2500);

        $remove = $this->withHeader('Authorization', "Bearer {$token}")
            ->deleteJson('/api/cart/remove', [
                'product_id' => $product->id,
            ]);

        $remove->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.total_cents', 0)
            ->assertJsonCount(0, 'data.items');
    }
}
