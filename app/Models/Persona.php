<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Persona extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'project_id',
        'profile',
        'expectations',
        'restrictions', 
        'goals'
    ];

    protected $casts = [
        'profile' => 'array',
        'expectations' => 'array',
        'restrictions' => 'array',
        'goals' => 'array'
    ];

    public function project()
    {
        return $this->belongsTo(Project::class);
    }
}
