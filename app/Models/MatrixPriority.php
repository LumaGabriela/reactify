<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MatrixPriority extends Model
{
  protected $fillable = ['name', 'color', 'project_id', 'order_column'];

  public function prioritizations()
  {
    return $this->hasMany(Prioritization::class);
  }

  public function project()
  {
    return $this->belongsTo(Project::class);
  }
}
