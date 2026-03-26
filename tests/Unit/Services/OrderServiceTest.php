<?php

namespace Tests\Unit\Services;

use App\Exceptions\CheckoutException;
use App\Models\Cart;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use App\Services\CartService;
use App\Services\OrderService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class OrderServiceTest extends TestCase
{
    use RefreshDatabase;

    public function test_checkout_creates_paid_order_marks_cart_completed_and_reopens_active_cart(): void
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
        $this->assertSame(Order::STATUS_PAID, $order['status']);
        $this->assertEmpty($cart['items']);
        $this->assertSame(0, $cart['total_cents']);

        $this->assertDatabaseHas('carts', [
            'user_id' => $user->id,
            'status' => Cart::STATUS_COMPLETED,
        ]);

        $this->assertDatabaseHas('carts', [
            'user_id' => $user->id,
            'status' => Cart::STATUS_ACTIVE,
        ]);
    }

    public function test_checkout_fails_with_empty_cart(): void
    {
        $user = User::factory()->create();

        $this->expectException(CheckoutException::class);

        app(OrderService::class)->checkout($user->id);
    }
}
