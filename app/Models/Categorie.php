<?php

namespace App\Models;

use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Categorie extends Model
{
    use HasFactory;

    protected $table = 'categories';

    protected $fillable = [
        'name',
        'slug',
        'image',
        'available',
        'frais_expedition',
        'description',
        'meta_title',
        'meta_keywords',
        'meta_description',
        'created_at',
        'updated_at',
    ];

    /**
     * Summary of categories
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function products():HasMany{
        return $this->hasMany(Product::class);
    }
}
