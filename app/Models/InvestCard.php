<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class InvestCard extends Model
{
  protected $fillable = [
    'story_id',
    'project_id',
    'independent',
    'negotiable',
    'valuable',
    'estimable',
    'small',
    'testable'
  ];

  public function story()
  {
    return $this->belongsTo(Story::class);
  }

  public function project()
  {
    return $this->belongsTo(Project::class);
  }
}
