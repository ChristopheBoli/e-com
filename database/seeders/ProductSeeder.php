<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;

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

        Product::factory()->count(10)->create();
    }
}
