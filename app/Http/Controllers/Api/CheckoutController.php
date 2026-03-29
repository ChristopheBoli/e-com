<?php

namespace App\Http\Controllers\Api;

use App\Exceptions\CheckoutException;
use App\Http\Controllers\Api\Concerns\ApiResponse;
use App\Http\Controllers\Controller;
use App\Services\OrderService;
use Illuminate\Http\JsonResponse;

class CheckoutController extends Controller
{
    use ApiResponse;

    public function __construct(
        private readonly OrderService $orderService,
    ) {
    }

    public function checkout(): JsonResponse
    {
        try {
            $user = auth('api')->user();

            return $this->success(
                $this->orderService->checkout((int) $user->id),
                'Commande créée avec succès.',
                201
            );
        } catch (CheckoutException $exception) {
            return $this->error($exception->getMessage(), null, 422);
        }
    }
}
