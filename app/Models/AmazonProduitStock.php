<?php

namespace App\Models;

use App\Models\AmazonProduit;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AmazonProduitStock extends Model
{
    use HasFactory;

    protected $table = 'amazon_stocks';

    protected $fillable = [
        'produit_id',
        'quantite_disponible',
        'saisi_par',
        'created_at',
        'updated_at',
    ];

    /**
     * Summary of user
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function produit():BelongsTo{
        return $this->BelongsTo(AmazonProduit::class);
    }
}
