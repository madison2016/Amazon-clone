<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;

class Shop extends Model
{
    use HasFactory;

    protected $table = 'boutiques';

    protected $primaryKey = 'id';

    protected $fillable = [
        'name',
        'email',
        'phone',
        'site_web',
        'zip_code',
        'pays',
        'adresse',
        'status',
        'user_id',
        'created_at',
        'updated_at',
    ];

    public function user():BelongsTo{
        return $this->BelongsTo(User::class);
    }

    /**
     * Summary of categories
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function products():HasMany{
        return $this->hasMany(Product::class);
    }
}
