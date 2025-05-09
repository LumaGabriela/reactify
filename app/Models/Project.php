<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    protected $fillable = [
        'title',
        'description',
    ];

    // Relação: Um projeto pertence a um usuário
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
