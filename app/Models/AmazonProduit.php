<?php

namespace App\Models;

use App\Models\AmazonCategorieProduit;
use App\Models\AmazonPanier;
use App\Models\AmazonProduitStock;
use App\Models\AmazonStore;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class AmazonProduit extends Model
{
    use HasFactory;

    protected $table = 'amazon_produits';

    protected $fillable = [
        'categorie_produit_id',
        'store_id',
        'designation',
        'unite_emballage',
        'devise',
        'etat',
        'prix_unitaire',
        'prix_gros',
        'niveau_alerte',
        'seuil_recompletement',   
        'created_at',
        'updated_at',
    ];

    /**
     * Summary of user
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function detail():HasOne{
        return $this->hasOne(AmazonProduitDetail::class, 'produit_id', 'id');
    }

    /**
     * Summary of user
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function stock():HasOne{
        return $this->hasOne(AmazonProduitStock::class, 'produit_id', 'id');
    }

    /**
     * Summary of user
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function categorie_produit():BelongsTo{
        return $this->BelongsTo(AmazonCategorieProduit::class);
    }

    public function store():BelongsTo{
        return $this->BelongsTo(AmazonStore::class);
    }

    /**
     * Summary of user
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function paniers():BelongsToMany{
        return $this->BelongsToMany(AmazonPanier::class, 'paniers_produits', 'produit_id', 'panier_id')->withPivot('quantite_commandee', 'prix_vente');
    }
}
