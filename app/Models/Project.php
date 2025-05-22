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
    'status',
  ];

  protected $casts = [
    'active' => 'boolean',
  ];
  // Relação: Um projeto pertence a um usuário
  public function user()
  {
    return $this->belongsTo(User::class);
  }

  public function journeys()
  {
    return $this->hasMany(Journey::class);
  }

  public function product_canvas()
  {
    return $this->hasOne(ProductCanvas::class);
  }

  public function personas()
  {
    return $this->hasMany(Persona::class);
  }
  public function goal_sketches()
  {
    return $this->hasMany(Goal::class);
  }

  public function stories()
  {
    return $this->hasMany(Story::class);
  }
}
