<?php

use App\Http\Controllers\Api\Admin\ProductAdminController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CartController;
use App\Http\Controllers\Api\CheckoutController;
use App\Http\Controllers\Api\ProductController;
use Illuminate\Support\Facades\Route;

Route::prefix('auth')->group(function (): void {
    Route::post('register', [AuthController::class, 'register']);
    Route::post('login', [AuthController::class, 'login']);

    Route::middleware('auth:api')->group(function (): void {
        Route::get('me', [AuthController::class, 'me']);
        Route::post('logout', [AuthController::class, 'logout']);
    });
});

Route::prefix('products')->group(function (): void {
    Route::get('/', [ProductController::class, 'index']);
    Route::get('{id}', [ProductController::class, 'show']);
});

Route::middleware('auth:api')->group(function (): void {
    Route::prefix('cart')->group(function (): void {
        Route::get('/', [CartController::class, 'show']);

        Route::post('add', [CartController::class, 'add']);
        Route::put('update', [CartController::class, 'updateQuantity']);
        Route::delete('remove', [CartController::class, 'remove']);

        Route::post('items', [CartController::class, 'add']);
        Route::patch('items', [CartController::class, 'updateQuantity']);
        Route::delete('items', [CartController::class, 'remove']);
        Route::delete('/', [CartController::class, 'clear']);
    });

    Route::post('checkout', [CheckoutController::class, 'checkout']);

    Route::prefix('admin')->middleware('admin')->group(function (): void {
        Route::prefix('products')->group(function (): void {
            Route::get('/', [ProductAdminController::class, 'index']);
            Route::get('{id}', [ProductAdminController::class, 'show']);
            Route::post('/', [ProductAdminController::class, 'store']);
            Route::put('{id}', [ProductAdminController::class, 'update']);
            Route::post('bulk-stock', [ProductAdminController::class, 'bulkUpdateStock']);
            Route::delete('{id}', [ProductAdminController::class, 'destroy']);
        });
    });
});
