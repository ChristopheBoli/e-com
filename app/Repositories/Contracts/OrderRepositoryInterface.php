<?php

namespace App\Repositories\Contracts;

use App\Models\Order;

interface OrderRepositoryInterface
{
    public function create(array $data): Order;
}
