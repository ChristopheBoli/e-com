<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Order extends Model
{
    use HasFactory;

    public const STATUS_PENDING = 'pending';

    public const STATUS_PAID = 'paid';

    /**
     * @var list<string>
     */
    protected $fillable = [
        'user_id',
        'order_number',
        'total_cents',
        'status',
        'items_snapshot',
        'placed_at',
    ];

    /**
     * @var array<string, string>
     */
    protected $casts = [
        'total_cents' => 'integer',
        'items_snapshot' => 'array',
        'placed_at' => 'datetime',
        'status' => 'string',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
