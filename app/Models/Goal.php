<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Goal extends Model
{
  protected $guarded = [
    'id',
  ];

  protected $table = 'goal_sketches';

  public function project()
  {
    return $this->belongsTo(Project::class);
  }
}
