<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Story extends Model
{
  use SoftDeletes;
  
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
