<?php

namespace App\Repositories\Eloquent;

use App\Models\Product;
use App\Repositories\Contracts\ProductRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Collection;

class ProductRepository implements ProductRepositoryInterface
{
    public function paginateActive(int $perPage = 15, ?string $search = null): LengthAwarePaginator
    {
        return Product::query()
            ->active()
            ->when($search !== null && $search !== '', function (Builder $query) use ($search): void {
                $query->where(function (Builder $subQuery) use ($search): void {
                    $subQuery
                        ->where('name', 'like', "%{$search}%")
                        ->orWhere('sku', 'like', "%{$search}%")
                        ->orWhere('description', 'like', "%{$search}%");
                });
            })
            ->orderBy('name')
            ->paginate($perPage);
    }

    public function paginateAll(int $perPage = 15, ?string $search = null, ?bool $isActive = null): LengthAwarePaginator
    {
        return Product::query()
            ->when($search !== null && $search !== '', function (Builder $query) use ($search): void {
                $query->where(function (Builder $subQuery) use ($search): void {
                    $subQuery
                        ->where('name', 'like', "%{$search}%")
                        ->orWhere('sku', 'like', "%{$search}%")
                        ->orWhere('description', 'like', "%{$search}%");
                });
            })
            ->when($isActive !== null, function (Builder $query) use ($isActive): void {
                $query->where('is_active', $isActive);
            })
            ->orderByDesc('created_at')
            ->paginate($perPage);
    }

    public function findById(int $id): ?Product
    {
        return Product::query()->find($id);
    }

    public function findActiveById(int $id): ?Product
    {
        return Product::query()
            ->active()
            ->find($id);
    }

    public function create(array $data): Product
    {
        return Product::query()->create($data);
    }

    public function update(Product $product, array $data): Product
    {
        $product->update($data);

        return $product->refresh();
    }

    public function delete(Product $product): void
    {
        $product->delete();
    }

    public function findManyForUpdate(array $productIds): Collection
    {
        return Product::query()
            ->whereIn('id', $productIds)
            ->lockForUpdate()
            ->get()
            ->keyBy('id');
    }

    public function decrementStock(Product $product, int $quantity): void
    {
        $product->decrement('stock_quantity', $quantity);
    }

    public function updateStock(Product $product, int $stockQuantity): Product
    {
        $product->update(['stock_quantity' => $stockQuantity]);

        return $product->refresh();
    }
}
