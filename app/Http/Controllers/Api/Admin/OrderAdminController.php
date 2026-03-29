<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Api\Concerns\ApiResponse;
use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\JsonResponse;

class OrderAdminController extends Controller
{
    use ApiResponse;

    public function index(): JsonResponse
    {
        $orders = Order::query()
            ->with('user:id,name,email')
            ->orderByDesc('placed_at')
            ->paginate(15)
            ->through(static function (Order $order): array {
                return [
                    'id' => $order->id,
                    'order_number' => $order->order_number,
                    'status' => $order->status,
                    'total_cents' => (int) $order->total_cents,
                    'placed_at' => $order->placed_at,
                    'customer' => [
                        'name' => $order->user?->name,
                        'email' => $order->user?->email,
                    ],
                ];
            });

        return $this->success($orders, 'Commandes admin récupérées.');
    }
}
