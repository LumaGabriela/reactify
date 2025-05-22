<?php

namespace App\Console\Commands;

use App\Events\ProjectUpdated;
use Illuminate\Console\Command;
use App\Models\Project;
use Illuminate\Support\Facades\Event;

class EventCommand extends Command
{
  /**
   * The name and signature of the console command.
   *
   * @var string
   */
  protected $signature = 'event';

  /**
   * The console command description.
   *
   * @var string
   */
  protected $description = 'Command description';

  /**
   * Execute the console command.
   */
  public function handle()
  {
    $project = Project::find(1);
    $project->title = 'Projeto Exemplo: ' . date('Y-m-d H:i:s');
    $project->save();

    if (!$project) {
      $this->error('Projeto com ID 1 não encontrado.');
      return;
    }
    event(new ProjectUpdated($project));
    $this->info('Evento ProjectUpdated disparado com sucesso.' . $project->title);
  }
}
