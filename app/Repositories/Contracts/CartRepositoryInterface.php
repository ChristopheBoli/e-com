<?php

namespace App\Repositories\Contracts;

use App\Models\Cart;
use App\Models\CartItem;

interface CartRepositoryInterface
{
    public function getOrCreateForUser(int $userId): Cart;

    public function getForUserWithItems(int $userId): Cart;

    public function findItemByProductId(int $cartId, int $productId): ?CartItem;

    public function saveItem(CartItem $item): CartItem;

    public function removeItem(CartItem $item): void;

    public function clearItems(Cart $cart): void;

    public function complete(Cart $cart): Cart;
}
