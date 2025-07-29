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

  public function changeRequests()
  {
      return $this->belongsToMany(ChangeRequest::class, 'change_request_story')
          ->withPivot('impact_type')
          ->withTimestamps();
  }
}
