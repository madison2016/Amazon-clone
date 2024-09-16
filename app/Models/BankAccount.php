<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Model;

class BankAccount extends Model
{
    use HasFactory;

    protected $table = 'user_bank_accounts';

    protected $primaryKey = 'id';

    protected $fillable = [
        'user_id',
        'code_bic',
        'code_iban',
        'nom_titulaire',
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
