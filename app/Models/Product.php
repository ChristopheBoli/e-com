<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Product extends Model
{
    use HasFactory;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'slug',
        'sku',
        'description',
        'price_cents',
        'stock_quantity',
        'is_active',
        'image',
        'image_url',
    ];

    /**
     * @var array<string, string>
     */
    protected $casts = [
        'price_cents' => 'integer',
        'stock_quantity' => 'integer',
        'is_active' => 'boolean',
    ];

    public function cartItems(): HasMany
    {
        return $this->hasMany(CartItem::class);
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}
