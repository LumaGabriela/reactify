<?php

namespace App\Events;

use App\Models\Project;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class ProjectDeleted implements ShouldBroadcast
{
  use Dispatchable, InteractsWithSockets, SerializesModels;

  public $projectId;

  public function __construct(Project $project)
  {
    $this->projectId = $project->id;
  }

  /**
   * Get the channels the event should broadcast on.
   *
   * @return array<int, \Illuminate\Broadcasting\Channel>
   */
  public function broadcastOn(): array
  {
    return [
      new PrivateChannel('projects'),
    ];
  }
  

  public function broadcastWith()
  {
    return [
      'projectId' => $this->projectId
    ];
  }
}
