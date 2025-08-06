<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Prioritization extends Model
{
  protected $fillable = ['story_id', 'project_id', 'position', 'priority_id'];

  public function project()
  {
    return $this->belongsTo(Project::class);
  }

  public function matrixPriority()
  {
    return $this->belongsTo(MatrixPriority::class);
  }
}
