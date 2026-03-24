<?php

namespace App\Repositories\Contracts;

use App\Models\Product;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

interface ProductRepositoryInterface
{
    public function paginateActive(int $perPage = 15): LengthAwarePaginator;

    public function paginateAll(int $perPage = 15): LengthAwarePaginator;

    public function findById(int $id): ?Product;

    public function findActiveById(int $id): ?Product;

    public function create(array $data): Product;

    public function update(Product $product, array $data): Product;

    public function delete(Product $product): void;

    /**
     * @return Collection<int, Product>
     */
    public function findManyForUpdate(array $productIds): Collection;

    public function decrementStock(Product $product, int $quantity): void;
}
