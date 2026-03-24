<?php

namespace App\Http\Controllers\Api;

use App\Exceptions\CartException;
use App\Http\Controllers\Api\Concerns\ApiResponse;
use App\Http\Controllers\Controller;
use App\Http\Requests\Cart\CartAddItemRequest;
use App\Http\Requests\Cart\CartRemoveItemRequest;
use App\Http\Requests\Cart\CartUpdateItemRequest;
use App\Services\CartService;
use Illuminate\Http\JsonResponse;

class CartController extends Controller
{
    use ApiResponse;

    public function __construct(
        private readonly CartService $cartService,
    ) {
    }

    public function show(): JsonResponse
    {
        $user = auth('api')->user();

        return $this->success(
            $this->cartService->getForUser((int) $user->id),
            'Panier récupéré.'
        );
    }

    public function add(CartAddItemRequest $request): JsonResponse
    {
        try {
            $user = auth('api')->user();
            $data = $request->validated();

            return $this->success(
                $this->cartService->addItem((int) $user->id, (int) $data['product_id'], (int) $data['quantity']),
                'Produit ajouté au panier.'
            );
        } catch (CartException $exception) {
            return $this->error($exception->getMessage(), null, 422);
        }
    }

    public function updateQuantity(CartUpdateItemRequest $request): JsonResponse
    {
        try {
            $user = auth('api')->user();
            $data = $request->validated();

            return $this->success(
                $this->cartService->updateItemQuantity((int) $user->id, (int) $data['product_id'], (int) $data['quantity']),
                'Quantité mise à jour.'
            );
        } catch (CartException $exception) {
            return $this->error($exception->getMessage(), null, 422);
        }
    }

    public function remove(CartRemoveItemRequest $request): JsonResponse
    {
        try {
            $user = auth('api')->user();
            $data = $request->validated();

            return $this->success(
                $this->cartService->removeItem((int) $user->id, (int) $data['product_id']),
                'Produit supprimé du panier.'
            );
        } catch (CartException $exception) {
            return $this->error($exception->getMessage(), null, 422);
        }
    }

    public function clear(): JsonResponse
    {
        $user = auth('api')->user();

        $this->cartService->clear((int) $user->id);

        return $this->success(null, 'Panier vidé.');
    }
}
