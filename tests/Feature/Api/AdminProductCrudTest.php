<?php

namespace Tests\Feature\Api;

use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use PHPOpenSourceSaver\JWTAuth\Facades\JWTAuth;
use Tests\TestCase;

class AdminProductCrudTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_create_product(): void
    {
        $admin = User::factory()->admin()->create();
        $token = JWTAuth::fromUser($admin);

        $payload = [
            'name' => 'Casque Audio Pro',
            'sku' => 'SKU-HEAD-001',
            'description' => 'Casque audio professionnel',
            'price_cents' => 89900,
            'stock_quantity' => 35,
            'is_active' => true,
        ];

        $response = $this->withHeader('Authorization', "Bearer {$token}")
            ->postJson('/api/admin/products', $payload);

        $response->assertStatus(201)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.name', 'Casque Audio Pro')
            ->assertJsonPath('data.sku', 'SKU-HEAD-001');

        $this->assertDatabaseHas('products', [
            'name' => 'Casque Audio Pro',
            'sku' => 'SKU-HEAD-001',
            'price_cents' => 89900,
        ]);
    }

    public function test_admin_can_list_products_with_filters(): void
    {
        $admin = User::factory()->admin()->create();
        $token = JWTAuth::fromUser($admin);

        Product::factory()->create([
            'name' => 'Laptop Gamer',
            'sku' => 'SKU-LAP-001',
            'is_active' => true,
        ]);

        Product::factory()->create([
            'name' => 'Laptop Bureau',
            'sku' => 'SKU-LAP-002',
            'is_active' => false,
        ]);

        Product::factory()->create([
            'name' => 'Souris',
            'sku' => 'SKU-MOU-001',
            'is_active' => true,
        ]);

        $response = $this->withHeader('Authorization', "Bearer {$token}")
            ->getJson('/api/admin/products?search=Laptop&status=active');

        $response->assertStatus(200)
            ->assertJsonPath('success', true);

        $products = $response->json('data.data');

        $this->assertCount(1, $products);
        $this->assertSame('Laptop Gamer', $products[0]['name']);
    }

    public function test_admin_can_update_product(): void
    {
        $admin = User::factory()->admin()->create();
        $token = JWTAuth::fromUser($admin);

        $product = Product::factory()->create([
            'name' => 'Ancien Nom',
            'sku' => 'SKU-OLD-001',
        ]);

        $response = $this->withHeader('Authorization', "Bearer {$token}")
            ->putJson("/api/admin/products/{$product->id}", [
                'name' => 'Nouveau Nom',
                'price_cents' => 125000,
                'stock_quantity' => 12,
            ]);

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.name', 'Nouveau Nom')
            ->assertJsonPath('data.price_cents', 125000);

        $this->assertDatabaseHas('products', [
            'id' => $product->id,
            'name' => 'Nouveau Nom',
            'price_cents' => 125000,
            'stock_quantity' => 12,
        ]);
    }

    public function test_admin_can_bulk_update_stock(): void
    {
        $admin = User::factory()->admin()->create();
        $token = JWTAuth::fromUser($admin);

        $productA = Product::factory()->create(['stock_quantity' => 5]);
        $productB = Product::factory()->create(['stock_quantity' => 9]);

        $response = $this->withHeader('Authorization', "Bearer {$token}")
            ->postJson('/api/admin/products/bulk-stock', [
                'items' => [
                    ['id' => $productA->id, 'stock_quantity' => 30],
                    ['id' => $productB->id, 'stock_quantity' => 45],
                ],
            ]);

        $response->assertStatus(200)
            ->assertJsonPath('success', true);

        $this->assertDatabaseHas('products', [
            'id' => $productA->id,
            'stock_quantity' => 30,
        ]);

        $this->assertDatabaseHas('products', [
            'id' => $productB->id,
            'stock_quantity' => 45,
        ]);
    }

    public function test_admin_can_delete_product(): void
    {
        $admin = User::factory()->admin()->create();
        $token = JWTAuth::fromUser($admin);

        $product = Product::factory()->create();

        $response = $this->withHeader('Authorization', "Bearer {$token}")
            ->deleteJson("/api/admin/products/{$product->id}");

        $response->assertStatus(200)
            ->assertJsonPath('success', true);

        $this->assertDatabaseMissing('products', ['id' => $product->id]);
    }

    public function test_admin_can_upload_image_when_creating_product(): void
    {
        Storage::fake('public');

        $admin = User::factory()->admin()->create();
        $token = JWTAuth::fromUser($admin);

        $image = UploadedFile::fake()->image('product.jpg', 600, 600);

        $response = $this->withHeader('Authorization', "Bearer {$token}")
            ->post('/api/admin/products', [
                'name' => 'Produit Image',
                'sku' => 'SKU-IMG-001',
                'description' => 'Produit avec image',
                'price_cents' => 55000,
                'stock_quantity' => 10,
                'is_active' => true,
                'image' => $image,
            ], [
                'Accept' => 'application/json',
            ]);

        $response->assertStatus(201)
            ->assertJsonPath('success', true);

        $product = Product::query()->where('sku', 'SKU-IMG-001')->first();

        $this->assertNotNull($product);
        $this->assertNotNull($product->image);
        $this->assertNotNull($product->image_url);

        Storage::disk('public')->assertExists($product->image);
    }
}
