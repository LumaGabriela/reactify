<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Enums\InvestCardStatus;

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

  protected $casts = [
    'independent' => InvestCardStatus::class,
    'negotiable' => InvestCardStatus::class,
    'valuable' => InvestCardStatus::class,
    'estimable' => InvestCardStatus::class,
    'small' => InvestCardStatus::class,
    'testable' => InvestCardStatus::class,
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
