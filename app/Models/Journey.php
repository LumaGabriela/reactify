<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Journey extends Model
{
    protected $guarded = [];

    protected $casts = [
      'steps'=> 'array'
    ];

    public function project() 
    {
        return $this->belongsTo(Project::class);
    }
}

