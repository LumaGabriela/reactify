<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Story extends Model
{
  protected $fillable = [
    'id',
    'title',
    'type',
    'project_id'
  ];

  public function project()
  {
    return $this->belongsTo(Project::class);
  }
}
