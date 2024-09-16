<?php

namespace App\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CreditCard extends Model
{
    use HasFactory;

    protected $table = 'user_credit_cards';

    protected $primaryKey = 'id';

    protected $fillable = [
        'user_id',
        'card_model',
        'num_card',
        'expires_date',
        'nom_titulaire',
        'code_securite',
        'created_at',
        'updated_at',
    ];

    /**
     * Summary of users
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function user():BelongsTo{
        return $this->BelongsTo(User::class, "user_id", "id");
    }
}
