<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductCanvas extends Model
{
  protected $fillable = [
    'issues',
    'solutions',
    'personas',
    'restrictions',
    'product_is',
    'product_is_not',
    'project_id'
  ];

  protected $table = 'product_canvas';
  
  public function project()
  {
    return $this->belongsTo(Project::class);
  }
}
