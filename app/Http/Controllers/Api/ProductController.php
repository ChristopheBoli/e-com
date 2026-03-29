<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\Concerns\ApiResponse;
use App\Http\Controllers\Controller;
use App\Services\ProductService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    use ApiResponse;

    public function __construct(
        private readonly ProductService $productService,
    ) {
    }

    public function index(Request $request): JsonResponse
    {
        $perPage = (int) $request->integer('per_page', 15);
        $search = $request->string('search')->toString();

        return $this->success(
            $this->productService->listPublic($perPage, $search !== '' ? $search : null),
            'Articles actifs récupérés.'
        );
    }

    public function show(int $id): JsonResponse
    {
        $product = $this->productService->showPublic($id);

        if (! $product) {
            return $this->error('Article introuvable.', null, 404);
        }

        return $this->success($product, 'Article récupéré.');
    }
}
