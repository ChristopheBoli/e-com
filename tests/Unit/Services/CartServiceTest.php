<?php

namespace Tests\Unit\Services;

use App\Models\Product;
use App\Models\User;
use App\Services\CartService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CartServiceTest extends TestCase
{
    use RefreshDatabase;

    public function test_add_item_to_cart_creates_line_with_expected_quantity_and_snapshot_price(): void
    {
        $user = User::factory()->create();
        $product = Product::factory()->create([
            'price_cents' => 2599,
            'stock_quantity' => 10,
            'is_active' => true,
        ]);

        $service = app(CartService::class);

        $payload = $service->addItem($user->id, $product->id, 2);

        $this->assertSame(1, count($payload['items']));
        $this->assertSame(2, $payload['items'][0]['quantity']);
        $this->assertSame(2599, $payload['items'][0]['unit_price_cents']);
        $this->assertSame(5198, $payload['total_cents']);
    }

    public function test_cart_total_is_recalculated_after_quantity_update(): void
    {
        $user = User::factory()->create();
        $product = Product::factory()->create([
            'price_cents' => 1000,
            'stock_quantity' => 20,
            'is_active' => true,
        ]);

        $service = app(CartService::class);
        $service->addItem($user->id, $product->id, 1);

        $updated = $service->updateItemQuantity($user->id, $product->id, 5);

        $this->assertSame(5000, $updated['total_cents']);
        $this->assertSame(5, $updated['items'][0]['quantity']);
        $this->assertSame(5000, $updated['items'][0]['line_total_cents']);
    }
}
