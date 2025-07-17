<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;

use Illuminate\Database\Eloquent\Model;

class ProjectInvitation extends Model
{
  protected $fillable = ['email', 'token', 'project_id', 'role', 'status', 'expires_at', 'inviter_id'];

  public function project(): BelongsTo
  {
    return $this->belongsTo(Project::class);
  }

  public function inviter()
  {
    return $this->belongsTo(User::class, 'inviter_id');
  }
}
