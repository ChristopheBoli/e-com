<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\Concerns\ApiResponse;
use App\Http\Controllers\Controller;
use App\Services\ProductService;
use Illuminate\Http\JsonResponse;

class ProductController extends Controller
{
    use ApiResponse;

    public function __construct(
        private readonly ProductService $productService,
    ) {
    }

    public function index(): JsonResponse
    {
        return $this->success(
            $this->productService->listPublic(),
            'Produits actifs récupérés.'
        );
    }

    public function show(int $id): JsonResponse
    {
        $product = $this->productService->showPublic($id);

        if (! $product) {
            return $this->error('Produit introuvable.', null, 404);
        }

        return $this->success($product, 'Produit récupéré.');
    }
}
