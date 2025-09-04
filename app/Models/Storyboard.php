<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Storyboard extends Model
{
  protected $fillable = ['story_id', 'image_url'];

  public function story()
  {
    return $this->belongsTo(Story::class);
  }
  public function project()
  {
    return $this->belongsTo(Project::class);
  }
}
