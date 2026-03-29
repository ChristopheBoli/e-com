<?php

namespace App\Repositories\Eloquent;

use App\Models\Cart;
use App\Models\CartItem;
use App\Repositories\Contracts\CartRepositoryInterface;

class CartRepository implements CartRepositoryInterface
{
    public function getOrCreateForUser(int $userId): Cart
    {
        return Cart::query()->firstOrCreate(
            [
                'user_id' => $userId,
                'status' => Cart::STATUS_ACTIVE,
            ],
            [
                'status' => Cart::STATUS_ACTIVE,
            ]
        );
    }

    public function getForUserWithItems(int $userId): Cart
    {
        $cart = $this->getOrCreateForUser($userId);

        $cart->load(['items.product']);

        return $cart;
    }

    public function findItemByProductId(int $cartId, int $productId): ?CartItem
    {
        return CartItem::query()
            ->where('cart_id', $cartId)
            ->where('product_id', $productId)
            ->first();
    }

    public function saveItem(CartItem $item): CartItem
    {
        $item->save();

        return $item->refresh();
    }

    public function removeItem(CartItem $item): void
    {
        $item->delete();
    }

    public function clearItems(Cart $cart): void
    {
        $cart->items()->delete();
    }

    public function complete(Cart $cart): Cart
    {
        $cart->status = Cart::STATUS_COMPLETED;
        $cart->save();

        return $cart->refresh();
    }
}
