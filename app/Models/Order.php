<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $table = 'orders';

    protected $fillable = [
        'user_id',
        'payment_id',
        'name',
        'email',
        'phone',
        'phone2',
        'pays',
        'boite_postale',
        'adresse',
        'payment_mode',
        'payment_id',
        'etat',
        'observations',
        'tracking_number',
        'created_at',
        'updated_at',
    ];

    /**
     * Summary of shops
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function orderitems():HasMany{
        return $this->hasMany(OrderItems::class, 'order_id', 'id');
    }
}
