<?php

namespace App\Models;

use App\Models\AmazonProduit;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AmazonProduitDetail extends Model
{
    use HasFactory;

    protected $table = 'amazon_detail_produits';

    protected $fillable = [
        'produit_id',
        'description',
        'photo_1',
        'photo_2',
        'photo_3',
        'photo_4',
        'photo_5',
        'video_explained',
        'created_at',
        'updated_at',
    ];

    /**
     * Summary of user
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function produit():BelongsTo{
        return $this->belongsTo(AmazonProduit::class);
    }
}
