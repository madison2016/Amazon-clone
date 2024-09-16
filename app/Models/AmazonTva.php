<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AmazonTva extends Model
{
    use HasFactory;

    protected $table = 'amazon_tva';

    protected $fillable = [
        'taux',
        'description',
    ];
}
