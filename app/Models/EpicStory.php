<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EpicStory extends Model
{
  protected $fillable = [
    'title',
    'story_id',
    'project_id',

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
