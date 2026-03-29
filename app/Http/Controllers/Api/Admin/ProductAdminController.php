<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Api\Concerns\ApiResponse;
use App\Http\Controllers\Controller;
use App\Http\Requests\Product\ProductBulkStockUpdateRequest;
use App\Http\Requests\Product\ProductStoreRequest;
use App\Http\Requests\Product\ProductUpdateRequest;
use App\Services\ProductService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use RuntimeException;

class ProductAdminController extends Controller
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
        $status = $request->string('status')->toString();

        $isActive = match ($status) {
            'active' => true,
            'inactive' => false,
            default => null,
        };

        return $this->success(
            $this->productService->listAdmin($perPage, $search !== '' ? $search : null, $isActive),
            'Articles récupérés.'
        );
    }

    public function show(int $id): JsonResponse
    {
        $product = $this->productService->showAdmin($id);

        if (! $product) {
            return $this->error('Article introuvable.', null, 404);
        }

        return $this->success($product, 'Article récupéré.');
    }

    public function store(ProductStoreRequest $request): JsonResponse
    {
        $product = $this->productService->create($request->validated());

        return $this->success($product, 'Article créé.', 201);
    }

    public function update(ProductUpdateRequest $request, int $id): JsonResponse
    {
        try {
            $result = $this->productService->update($id, $request->validated());

            return $this->success($result, 'Article mis à jour.');
        } catch (RuntimeException $exception) {
            return $this->error($exception->getMessage(), null, 404);
        }
    }

    public function bulkUpdateStock(ProductBulkStockUpdateRequest $request): JsonResponse
    {
        try {
            $updated = $this->productService->bulkUpdateStock($request->validated('items'));

            return $this->success($updated, 'Stocks mis à jour.');
        } catch (RuntimeException $exception) {
            return $this->error($exception->getMessage(), null, 422);
        }
    }

    public function destroy(int $id): JsonResponse
    {
        try {
            $this->productService->delete($id);

            return $this->success(null, 'Article supprimé.');
        } catch (RuntimeException $exception) {
            return $this->error($exception->getMessage(), null, 404);
        }
    }
}
