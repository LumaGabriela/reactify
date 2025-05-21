<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Goal extends Model
{
  protected $fillable = [
    'title',
    'type',
    'priority',
    'project_id'
  ];

  protected $table = 'goal_sketches';

  public function project()
  {
    return $this->belongsTo(Project::class);
  }
}
