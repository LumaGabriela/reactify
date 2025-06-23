<?php

namespace App\Providers;

use App\Observers\StoryObserver;
use App\Observers\ProductCanvasObserver;
use App\Models\Story;
use App\Models\ProductCanvas;
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
  }
}
