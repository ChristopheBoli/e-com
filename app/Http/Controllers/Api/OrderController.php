<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\Concerns\ApiResponse;
use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\JsonResponse;

class OrderController extends Controller
{
    use ApiResponse;

    public function index(): JsonResponse
    {
        $user = auth('api')->user();

        $orders = Order::query()
            ->where('user_id', (int) $user->id)
            ->orderByDesc('placed_at')
            ->get()
            ->map(static function (Order $order): array {
                return [
                    'id' => $order->id,
                    'order_number' => $order->order_number,
                    'status' => $order->status,
                    'total_cents' => (int) $order->total_cents,
                    'items_snapshot' => $order->items_snapshot ?? [],
                    'placed_at' => $order->placed_at,
                ];
            })
            ->values();

        return $this->success($orders, 'Commandes récupérées.');
    }
}
