<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
class Goal extends Model
{
  use SoftDeletes;
  
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
