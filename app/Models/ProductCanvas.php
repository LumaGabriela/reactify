<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductCanvas extends Model
{
  protected $fillable = [
    'description',
    'solution',
    'project_is',
    'project_is_not',
    'project_id'
  ];
  public function project()
  {
    return $this->belongsTo(Project::class);
  }
}
