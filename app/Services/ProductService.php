<?php

namespace App\Services;

use App\Models\Product;
use App\Repositories\Contracts\ProductRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use RuntimeException;

class ProductService
{
    public function __construct(
        private readonly ProductRepositoryInterface $products,
    ) {
    }

    public function listPublic(int $perPage = 15, ?string $search = null): LengthAwarePaginator
    {
        return $this->products->paginateActive($perPage, $search);
    }

    public function listAdmin(int $perPage = 15, ?string $search = null, ?bool $isActive = null): LengthAwarePaginator
    {
        return $this->products->paginateAll($perPage, $search, $isActive);
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
     * @param  array<string, mixed>  $data
     * @return array<string, mixed>
     */
    public function create(array $data): array
    {
        $data['slug'] = Str::slug((string) $data['name']);
        $data['is_active'] = (bool) ($data['is_active'] ?? true);

        $this->attachImagePayload($data);

        return $this->transformProduct($this->products->create($data));
    }

    /**
     * @param  array<string, mixed>  $data
     * @return array<string, mixed>
     */
    public function update(int $id, array $data): array
    {
        $product = $this->products->findById($id);

        if (! $product) {
            throw new RuntimeException('Produit introuvable.');
        }

        if (isset($data['name'])) {
            $data['slug'] = Str::slug((string) $data['name']);
        }

        $this->attachImagePayload($data, $product);

        return $this->transformProduct($this->products->update($product, $data));
    }

    /**
     * @param  array<int, array{id:int,stock_quantity:int}>  $items
     * @return array<int, array<string, mixed>>
     */
    public function bulkUpdateStock(array $items): array
    {
        return DB::transaction(function () use ($items): array {
            $productIds = array_values(array_unique(array_map(
                static fn (array $item): int => (int) $item['id'],
                $items
            )));

            $products = $this->products->findManyForUpdate($productIds);

            if ($products->count() !== count($productIds)) {
                throw new RuntimeException('Un ou plusieurs produits sont introuvables pour la mise à jour du stock.');
            }

            $updated = [];

            foreach ($items as $item) {
                $productId = (int) $item['id'];
                $stockQuantity = (int) $item['stock_quantity'];

                /** @var Product|null $product */
                $product = $products->get($productId);

                if (! $product) {
                    throw new RuntimeException("Produit ID {$productId} introuvable.");
                }

                $product = $this->products->updateStock($product, $stockQuantity);
                $updated[] = $this->transformProduct($product);
            }

            return $updated;
        });
    }

    public function delete(int $id): void
    {
        $product = $this->products->findById($id);

        if (! $product) {
            throw new RuntimeException('Produit introuvable.');
        }

        if ($product->image) {
            Storage::disk('public')->delete($product->image);
        }

        $this->products->delete($product);
    }

    /**
     * @param  array<string, mixed>  $data
     */
    private function attachImagePayload(array &$data, ?Product $product = null): void
    {
        if (! isset($data['image']) || ! $data['image'] instanceof UploadedFile) {
            return;
        }

        if ($product && $product->image) {
            Storage::disk('public')->delete($product->image);
        }

        /** @var UploadedFile $imageFile */
        $imageFile = $data['image'];
        $path = $imageFile->store('products', 'public');

        $data['image'] = $path;
        $data['image_url'] = Storage::url($path);
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
            'image' => $product->image,
            'image_url' => $product->image_url,
            'created_at' => $product->created_at,
            'updated_at' => $product->updated_at,
        ];
    }
}
