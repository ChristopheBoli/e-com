<?php

namespace App\Services;

use App\Exceptions\CheckoutException;
use App\Models\Product;
use App\Repositories\Contracts\CartRepositoryInterface;
use App\Repositories\Contracts\OrderRepositoryInterface;
use App\Repositories\Contracts\ProductRepositoryInterface;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class OrderService
{
    public function __construct(
        private readonly CartRepositoryInterface $carts,
        private readonly ProductRepositoryInterface $products,
        private readonly OrderRepositoryInterface $orders,
    ) {
    }

    /**
     * @return array<string, mixed>
     */
    public function checkout(int $userId): array
    {
        return DB::transaction(function () use ($userId): array {
            $cart = $this->carts->getForUserWithItems($userId);

            if ($cart->items->isEmpty()) {
                throw new CheckoutException('Le panier est vide.');
            }

            $productIds = $cart->items->pluck('product_id')->unique()->all();
            $lockedProducts = $this->products->findManyForUpdate($productIds);

            $snapshotItems = [];
            $totalCents = 0;

            foreach ($cart->items as $item) {
                $product = $lockedProducts->get($item->product_id);

                if (! $product || ! $product->is_active) {
                    throw new CheckoutException('Un produit du panier est indisponible.');
                }

                if ($item->quantity > $product->stock_quantity) {
                    throw new CheckoutException("Stock insuffisant pour le produit {$product->name}.");
                }

                $lineTotal = $item->quantity * $item->unit_price_cents;
                $totalCents += $lineTotal;

                $snapshotItems[] = [
                    'product_id' => $product->id,
                    'name' => $product->name,
                    'sku' => $product->sku,
                    'quantity' => $item->quantity,
                    'unit_price_cents' => $item->unit_price_cents,
                    'line_total_cents' => $lineTotal,
                ];
            }

            foreach ($cart->items as $item) {
                /** @var Product $product */
                $product = $lockedProducts->get($item->product_id);
                $this->products->decrementStock($product, $item->quantity);
            }

            $order = $this->orders->create([
                'user_id' => $userId,
                'order_number' => $this->generateUniqueOrderNumber(),
                'total_cents' => $totalCents,
                'status' => 'placed',
                'items_snapshot' => $snapshotItems,
                'placed_at' => now(),
            ]);

            $this->carts->clearItems($cart);

            return [
                'order_id' => $order->id,
                'order_number' => $order->order_number,
                'status' => $order->status,
                'total_cents' => $order->total_cents,
                'items' => $snapshotItems,
                'placed_at' => $order->placed_at,
            ];
        });
    }

    private function generateUniqueOrderNumber(): string
    {
        do {
            $candidate = sprintf('ORD-%s-%s', now()->format('YmdHis'), Str::upper(Str::random(6)));
        } while (DB::table('orders')->where('order_number', $candidate)->exists());

        return $candidate;
    }
}
