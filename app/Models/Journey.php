<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Journey extends Model
{
  protected $fillable = [
    'title',
    'steps',
    'project_id'
  ];

  protected $casts = [
    'steps' => 'array'
  ];

  public function project()
  {
    return $this->belongsTo(Project::class);
  }
  
  // Método para adicionar steps
  public function addSteps(array $steps)
  {
    $this->steps = $steps;
    $this->save();
  }
}
