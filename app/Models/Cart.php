<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Cart extends Model
{
    use HasFactory;

    public const STATUS_ACTIVE = 'active';

    public const STATUS_COMPLETED = 'completed';

    /**
     * @var list<string>
     */
    protected $fillable = [
        'user_id',
        'status',
    ];

    /**
     * @var array<string, string>
     */
    protected $casts = [
        'status' => 'string',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(CartItem::class);
    }

    public function calculateTotalCents(): int
    {
        return (int) $this->items()
            ->selectRaw('COALESCE(SUM(quantity * unit_price_cents), 0) as total')
            ->value('total');
    }
}
