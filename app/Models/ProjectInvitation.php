<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;

use Illuminate\Database\Eloquent\Model;

class ProjectInvitation extends Model
{
  protected $fillable = ['email', 'token', 'project_id', 'role', 'status', 'expires_at', 'inviter_id'];

  public function accept(): void
  {
    $this->update(['status' => 'accepted']);
  }

  public function decline(): void
  {
    $this->update(['status' => 'declined']);
  }
  public function isExpired(): bool
  {
    return now()->greaterThan($this->expires_at);
  }

  public function isPending(): bool
  {
    return $this->status === 'pending';
  }

  public function project(): BelongsTo
  {
    return $this->belongsTo(Project::class);
  }

  public function inviter(): BelongsTo
  {
    return $this->belongsTo(User::class, 'inviter_id');
  }
}
