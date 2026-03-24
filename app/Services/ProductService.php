<?php

namespace App\Services;

use App\Models\Product;
use App\Repositories\Contracts\ProductRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Str;
use RuntimeException;

class ProductService
{
    public function __construct(
        private readonly ProductRepositoryInterface $products,
    ) {
    }

    public function listPublic(int $perPage = 15): LengthAwarePaginator
    {
        return $this->products->paginateActive($perPage);
    }

    public function listAdmin(int $perPage = 15): LengthAwarePaginator
    {
        return $this->products->paginateAll($perPage);
    }

    /**
     * @return array<string, mixed>|null
     */
    public function showPublic(int $id): ?array
    {
        $product = $this->products->findActiveById($id);

        return $product ? $this->transformProduct($product) : null;
    }

    /**
     * @return array<string, mixed>|null
     */
    public function showAdmin(int $id): ?array
    {
        $product = $this->products->findById($id);

        return $product ? $this->transformProduct($product) : null;
    }

    /**
     * @return array<string, mixed>
     */
    public function create(array $data): array
    {
        $data['slug'] = Str::slug($data['name']);
        $data['is_active'] = (bool) ($data['is_active'] ?? true);

        return $this->transformProduct($this->products->create($data));
    }

    /**
     * @return array<string, mixed>
     */
    public function update(int $id, array $data): array
    {
        $product = $this->products->findById($id);

        if (! $product) {
            throw new RuntimeException('Produit introuvable.');
        }

        if (isset($data['name'])) {
            $data['slug'] = Str::slug($data['name']);
        }

        return $this->transformProduct($this->products->update($product, $data));
    }

    public function delete(int $id): void
    {
        $product = $this->products->findById($id);

        if (! $product) {
            throw new RuntimeException('Produit introuvable.');
        }

        $this->products->delete($product);
    }

    /**
     * @return array<string, mixed>
     */
    private function transformProduct(Product $product): array
    {
        return [
            'id' => $product->id,
            'name' => $product->name,
            'slug' => $product->slug,
            'sku' => $product->sku,
            'description' => $product->description,
            'price_cents' => $product->price_cents,
            'stock_quantity' => $product->stock_quantity,
            'is_active' => $product->is_active,
            'created_at' => $product->created_at,
            'updated_at' => $product->updated_at,
        ];
    }
}
