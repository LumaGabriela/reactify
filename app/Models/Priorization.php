<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Priorization extends Model
{
  protected $fillable = ['story_id', 'project_id', 'position', 'priority'];

  public function project()
  {
    return $this->belongsTo(Project::class);
  }
}
