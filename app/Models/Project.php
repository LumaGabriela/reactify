<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'status'
    ];

    // Relação: Um projeto pertence a um usuário
    public function user()
    {
        return $this->belongsTo(User::class);
    }


    protected $casts = [
        'active' => 'boolean',
    ];
    
    public function stories() 
    {
        return $this->hasMany(Story::class);
    }
}
