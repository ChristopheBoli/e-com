<?php

namespace App\Services;

use App\Exceptions\CartException;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use App\Repositories\Contracts\CartRepositoryInterface;
use App\Repositories\Contracts\ProductRepositoryInterface;
use Illuminate\Support\Collection;

class CartService
{
    public function __construct(
        private readonly CartRepositoryInterface $carts,
        private readonly ProductRepositoryInterface $products,
    ) {
    }

    /**
     * @return array<string, mixed>
     */
    public function getForUser(int $userId): array
    {
        $cart = $this->carts->getForUserWithItems($userId);

        return $this->formatCartPayload($cart);
    }

    /**
     * @return array<string, mixed>
     */
    public function addItem(int $userId, int $productId, int $quantity): array
    {
        if ($quantity < 1) {
            throw new CartException('La quantité doit être supérieure à 0.');
        }

        $cart = $this->carts->getForUserWithItems($userId);
        $product = $this->products->findActiveById($productId);

        if (! $product) {
            throw new CartException('Produit introuvable ou inactif.');
        }

        $item = $this->carts->findItemByProductId($cart->id, $product->id);
        $newQuantity = ($item?->quantity ?? 0) + $quantity;

        if ($newQuantity > $product->stock_quantity) {
            throw new CartException('Stock insuffisant pour ce produit.');
        }

        if (! $item) {
            $item = new CartItem([
                'cart_id' => $cart->id,
                'product_id' => $product->id,
            ]);
        }

        $item->quantity = $newQuantity;
        $item->unit_price_cents = $product->price_cents;

        $this->carts->saveItem($item);

        return $this->getForUser($userId);
    }

    /**
     * @return array<string, mixed>
     */
    public function updateItemQuantity(int $userId, int $productId, int $quantity): array
    {
        if ($quantity < 1) {
            throw new CartException('La quantité doit être supérieure à 0.');
        }

        $cart = $this->carts->getForUserWithItems($userId);
        $item = $this->carts->findItemByProductId($cart->id, $productId);

        if (! $item) {
            throw new CartException('Produit absent du panier.');
        }

        $product = $this->products->findById($productId);

        if (! $product || ! $product->is_active) {
            throw new CartException('Produit introuvable ou inactif.');
        }

        if ($quantity > $product->stock_quantity) {
            throw new CartException('Stock insuffisant pour ce produit.');
        }

        $item->quantity = $quantity;
        $item->unit_price_cents = $product->price_cents;

        $this->carts->saveItem($item);

        return $this->getForUser($userId);
    }

    /**
     * @return array<string, mixed>
     */
    public function removeItem(int $userId, int $productId): array
    {
        $cart = $this->carts->getForUserWithItems($userId);
        $item = $this->carts->findItemByProductId($cart->id, $productId);

        if (! $item) {
            throw new CartException('Produit absent du panier.');
        }

        $this->carts->removeItem($item);

        return $this->getForUser($userId);
    }

    public function clear(int $userId): void
    {
        $cart = $this->carts->getForUserWithItems($userId);

        $this->carts->clearItems($cart);
    }

    /**
     * @return array<string, mixed>
     */
    private function formatCartPayload(Cart $cart): array
    {
        $cart->loadMissing(['items.product']);

        $items = $cart->items->map(function (CartItem $item): array {
            $product = $item->product;

            return [
                'product_id' => $item->product_id,
                'name' => $product?->name,
                'sku' => $product?->sku,
                'quantity' => $item->quantity,
                'unit_price_cents' => $item->unit_price_cents,
                'line_total_cents' => $item->line_total_cents,
            ];
        })->values();

        return [
            'cart_id' => $cart->id,
            'items' => $items->all(),
            'total_cents' => $this->sumTotalCents($items),
        ];
    }

    private function sumTotalCents(Collection $items): int
    {
        return (int) $items->sum('line_total_cents');
    }
}
