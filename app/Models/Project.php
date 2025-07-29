<?php

namespace App\Models;

use App\Enums\ProjectStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Project extends Model
{
  use HasFactory, SoftDeletes;

  protected $fillable = ['title', 'description', 'status'];

  protected $table = 'projects';

  protected $casts = [
    'active' => 'boolean',
    'status' => ProjectStatus::class,
  ];
  // Relação: Um projeto pertence a um usuário
  public function user()
  {
    return $this->belongsTo(User::class);
  }

  public function journeys()
  {
    return $this->hasMany(Journey::class);
  }

  public function product_canvas()
  {
    return $this->hasOne(ProductCanvas::class);
  }

  public function personas()
  {
    return $this->hasMany(Persona::class);
  }
  public function goal_sketches()
  {
    return $this->hasMany(Goal::class);
  }

  public function stories()
  {
    return $this->hasMany(Story::class);
  }

  public function invitations(): HasMany
  {
    return $this->hasMany(ProjectInvitation::class);
  }
  public function users(): BelongsToMany
  {
    return $this->belongsToMany(User::class, 'user_project')->withPivot('role')->withTimestamps();
  }

  public function overallModel()
  {
    return $this->hasOne(OverallModel::class);
  }

  public function sprints()
  {
      return $this->hasMany(Sprint::class);
  }

  public function changeRequests()
  {
      return $this->hasMany(ChangeRequest::class);
  }

  public function systemInterfaces()
  {
      return $this->hasMany(SystemInterface::class);
  }
}
