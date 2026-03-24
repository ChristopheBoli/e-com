<?php

namespace Tests\Unit\Services;

use App\Exceptions\CheckoutException;
use App\Models\Product;
use App\Models\User;
use App\Services\CartService;
use App\Services\OrderService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class OrderServiceTest extends TestCase
{
    use RefreshDatabase;

    public function test_checkout_creates_order_and_clears_cart(): void
    {
        $user = User::factory()->create();
        $product = Product::factory()->create([
            'price_cents' => 3000,
            'stock_quantity' => 5,
            'is_active' => true,
        ]);

        $cartService = app(CartService::class);
        $orderService = app(OrderService::class);

        $cartService->addItem($user->id, $product->id, 2);

        $order = $orderService->checkout($user->id);
        $cart = $cartService->getForUser($user->id);

        $this->assertSame(6000, $order['total_cents']);
        $this->assertCount(1, $order['items']);
        $this->assertEmpty($cart['items']);
        $this->assertSame(0, $cart['total_cents']);
    }

    public function test_checkout_fails_with_empty_cart(): void
    {
        $user = User::factory()->create();

        $this->expectException(CheckoutException::class);

        app(OrderService::class)->checkout($user->id);
    }
}
