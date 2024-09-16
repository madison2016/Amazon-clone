<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Profile extends Model
{
    use HasFactory;

    protected $table = 'profiles';

    protected $primaryKey = 'id';

    protected $fillable = [
        'user_id',
        'nom',
        'prenom',
        'sexe',
        'date_naissance',
        'photo',
        'phone',
        'phone2',
        'adresse',
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
