<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Model;

class CartShop extends Model
{
    use HasFactory;

    protected $table = 'cartshops';

    protected $primaryKey = 'id';

    protected $fillable = [
        'user_id',
        'produit_id',
        'name',
        'image',
        'selling_price',
        'stock_quantity',
        'created_at',
        'updated_at',
    ];

    /**
     * Summary of product
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function produit():BelongsTo{
        return $this->BelongsTo(Product::class, "produit_id", "id");
    }
}
