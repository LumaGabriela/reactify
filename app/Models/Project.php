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

    // public function goalSketches()
    // {
    //     return $this->hasMany(GoalSketch::class);
    // }

    // public function journeys()
    // {
    //     return $this->hasMany(Journey::class);
    // }

    // public function productCanvas()
    // {
    //     return $this->hasOne(ProductCanvas::class);
    // }

    // public function personas()
    // {
    //     return $this->hasMany(Persona::class);
    // }
    
    public function stories() 
    {
        return $this->hasMany(Story::class);
    }

    protected $casts = [
        'active' => 'boolean',
    ];
}
