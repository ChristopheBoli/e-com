<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Api\Concerns\ApiResponse;
use App\Http\Controllers\Controller;
use App\Http\Requests\Product\ProductStoreRequest;
use App\Http\Requests\Product\ProductUpdateRequest;
use App\Services\ProductService;
use Illuminate\Http\JsonResponse;
use RuntimeException;

class ProductAdminController extends Controller
{
    use ApiResponse;

    public function __construct(
        private readonly ProductService $productService,
    ) {
    }

    public function index(): JsonResponse
    {
        return $this->success(
            $this->productService->listAdmin(),
            'Produits récupérés.'
        );
    }

    public function show(int $id): JsonResponse
    {
        $product = $this->productService->showAdmin($id);

        if (! $product) {
            return $this->error('Produit introuvable.', null, 404);
        }

        return $this->success($product, 'Produit récupéré.');
    }

    public function store(ProductStoreRequest $request): JsonResponse
    {
        $product = $this->productService->create($request->validated());

        return $this->success($product, 'Produit créé.', 201);
    }

    public function update(ProductUpdateRequest $request, int $id): JsonResponse
    {
        try {
            return $this->success(
                $this->productService->update($id, $request->validated()),
                'Produit mis à jour.'
            );
        } catch (RuntimeException $exception) {
            return $this->error($exception->getMessage(), null, 404);
        }
    }

    public function destroy(int $id): JsonResponse
    {
        try {
            $this->productService->delete($id);

            return $this->success(null, 'Produit supprimé.');
        } catch (RuntimeException $exception) {
            return $this->error($exception->getMessage(), null, 404);
        }
    }
}
