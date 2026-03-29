<?php

namespace Database\Factories;

use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = fake()->unique()->words(3, true);

        return [
            'name' => Str::title($name),
            'slug' => Str::slug($name),
            'sku' => strtoupper(fake()->bothify('SKU-####-??')),
            'description' => fake()->sentence(14),
            'price_cents' => fake()->numberBetween(1500, 250000),
            'stock_quantity' => fake()->numberBetween(0, 200),
            'is_active' => true,
            'image' => null,
            'image_url' => 'https://placehold.co/400x400/e2e8f0/64748b?text=' . urlencode($name),
        ];
    }
}
