<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrderItems extends Model
{
    use HasFactory;

    protected $table = "orderitems";

    protected $fillable = [
        "order_id",
        "produit_id",
        "quantity",
        "selling_price",
        "created_at",
        "updated_at"
    ];
}
