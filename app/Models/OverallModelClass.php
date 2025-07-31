<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OverallModelClass extends Model
{
  protected $fillable = [
    'name',
    'project_id'
  ];

  public function project()
  {
    return $this->belongsTo(Project::class);
  }
}
