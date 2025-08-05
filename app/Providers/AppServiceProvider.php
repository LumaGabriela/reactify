<?php

namespace App\Providers;

use App\Observers\StoryObserver;
use App\Observers\ProductCanvasObserver;
use App\Observers\GoalSketchObserver;
use App\Observers\PersonaObserver;
use App\Observers\JourneyObserver;
use App\Observers\CrcCardObserver;
use App\Observers\PriorizationObserver;
use App\Models\Story;
use App\Models\ProductCanvas;
use App\Models\Goal;
use App\Models\Journey;
use App\Models\Persona;
use App\Models\CrcCard;
use App\Models\Priorization;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
  /**
   * Register any application services.
   */
  public function register(): void
  {
    //
  }

  /**
   * Bootstrap any application services.
   */
  public function boot(): void
  {
    Vite::prefetch(concurrency: 3);
    Story::observe(StoryObserver::class);
    ProductCanvas::observe(ProductCanvasObserver::class);
    Goal::observe(GoalSketchObserver::class);
    Persona::observe(PersonaObserver::class);
    Journey::observe(JourneyObserver::class);
    CrcCard::observe(CrcCardObserver::class);
    Priorization::observe(PriorizationObserver::class);
  }
}
