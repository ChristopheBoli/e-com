<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        if (! (bool) config('install.seed.with_demo_products', true)) {
            return;
        }

        $products = Product::factory()->count(10)->create();
        $demoImages = $this->resolveDemoImages();

        if ($demoImages === []) {
            return;
        }

        foreach ($products as $index => $product) {
            $sourcePath = $demoImages[$index % count($demoImages)];
            $extension = pathinfo($sourcePath, PATHINFO_EXTENSION) ?: 'jpg';
            $filename = Str::uuid()->toString().'.'.$extension;
            $storageRelativePath = 'products/'.$filename;
            $targetPath = storage_path('app/public/'.$storageRelativePath);

            File::ensureDirectoryExists(dirname($targetPath));
            File::copy($sourcePath, $targetPath);

            $product->update([
                'image' => $storageRelativePath,
                'image_url' => Storage::url($storageRelativePath),
            ]);
        }
    }

    /**
     * @return array<int, string>
     */
    private function resolveDemoImages(): array
    {
        $directory = public_path('demo/products');

        if (! File::isDirectory($directory)) {
            return [];
        }

        $patterns = ['*.jpg', '*.jpeg', '*.png', '*.webp', '*.gif'];
        $files = [];

        foreach ($patterns as $pattern) {
            foreach (File::glob($directory.DIRECTORY_SEPARATOR.$pattern) as $file) {
                $files[] = $file;
            }
        }

        sort($files);

        return $files;
    }
}
