<?php

namespace App\Models;

use App\Models\AmazonProduit;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class AmazonPanier extends Model
{
    use HasFactory;

    protected $table = 'amazon_paniers';

    protected $fillable = [
        'user_id',
        'produit_id',
        'name',
        'etat',
        'quantite_commandee',
        'prix_vente',
        'created_at',
        'updated_at',
    ];

     /**
     * Summary of user
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function user():BelongsTo{
        return $this->BelongsTo(User::class);
    }

    /**
     * Summary of user
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function produits():BelongsToMany{
        return $this->BelongsToMany(AmazonProduit::class, 'paniers_produits', 'panier_id', 'produit_id')->withPivot('quantite_commandee', 'prix_vente');
    }
}
