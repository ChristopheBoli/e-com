<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Order extends Model
{
    use HasFactory;

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
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
