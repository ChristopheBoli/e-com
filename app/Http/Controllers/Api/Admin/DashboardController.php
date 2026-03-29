<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Api\Concerns\ApiResponse;
use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\JsonResponse;

class DashboardController extends Controller
{
    use ApiResponse;

    public function index(): JsonResponse
    {
        $revenueCents = (int) Order::query()
            ->where('status', Order::STATUS_PAID)
            ->sum('total_cents');

        $ordersCount = (int) Order::query()->count();
        $productsCount = (int) Product::query()->count();
        $customersCount = (int) User::query()->where('role', User::ROLE_USER)->count();

        $recentOrders = Order::query()
            ->with('user:id,name,email')
            ->orderByDesc('placed_at')
            ->limit(5)
            ->get()
            ->map(static function (Order $order): array {
                return [
                    'id' => $order->id,
                    'order_number' => $order->order_number,
                    'customer' => [
                        'name' => $order->user?->name ?? 'Client',
                        'email' => $order->user?->email,
                    ],
                    'total_cents' => (int) $order->total_cents,
                    'status' => $order->status,
                    'placed_at' => $order->placed_at,
                ];
            })
            ->values();

        return $this->success([
            'stats' => [
                'revenue_cents' => $revenueCents,
                'orders_count' => $ordersCount,
                'products_count' => $productsCount,
                'customers_count' => $customersCount,
            ],
            'recent_orders' => $recentOrders,
        ], 'Dashboard admin récupéré.');
    }
}
