<?php

namespace App\Models;

use App\Enums\StoryBacklogStatus;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Story extends Model
{
  use SoftDeletes;
  
  protected $fillable = [
    'id',
    'title',
    'type',
    'project_id',
    'sprint_id',
    'backlog_status',
    'parent_id',
    'value',
    'complexity',
  ];

  protected $casts = [
      'backlog_status' => StoryBacklogStatus::class,
  ];

  public function project()
  {
    return $this->belongsTo(Project::class);
  }

  public function sprint()
  {
      return $this->belongsTo(Sprint::class);
  }

  public function businessRules()
  {
      return $this->hasMany(BusinessRule::class);
  }

  public function usageScenarios()
  {
      return $this->hasMany(UsageScenario::class);
  }

  public function changeRequests()
  {
      return $this->belongsToMany(ChangeRequest::class, 'change_request_story')
          ->withPivot('impact_type')
          ->withTimestamps();
  }

  /**
   * Get the parent story (the epic).
   */
  public function parent()
  {
      return $this->belongsTo(Story::class, 'parent_id');
  }

  /**
   * Get the child stories.
   */
  public function children()
  {
      return $this->hasMany(Story::class, 'parent_id');
  }
}
