<?php

namespace App\Models;

use App\Models\Categorie;
use App\Models\Shop;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Product extends Model
{
    use HasFactory;

    protected $table = 'produits';

    protected $primaryKey = 'id';

    protected $fillable = [
        'name',
        'packing_unit',
        'nature',
        'status',
        'image',
        'description',
        'selling_price',
        'unit_price',
        'stock_quantity',
        'alert_level',
        'boutique_id',
        'categorie_id',
        'created_at',
        'updated_at',
    ];

    /**
     * Summary of categories
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function categorie():BelongsTo{
        return $this->BelongsTo(Categorie::class, "categorie_id", "id");
    }

    /**
     * Summary of shops
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function shop():BelongsTo{
        return $this->BelongsTo(Shop::class, "boutique_id", "id");
    }
}
