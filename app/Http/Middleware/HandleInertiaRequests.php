<?php

namespace App\Http\Middleware;

use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
  /**
   * The root template that is loaded on the first page visit.
   *
   * @var string
   */
  protected $rootView = 'app';

  /**
   * Determine the current asset version.
   */
  public function version(Request $request): ?string
  {
    return parent::version($request);
  }

  /**
   * Define the props that are shared by default.
   *
   * @return array<string, mixed>
   */
  public function share(Request $request)
  {
    return array_merge(parent::share($request), [
      'auth' => [
        'user' =>
        fn() => $request->user() ? $request->user()->only(['id', 'name', 'email', 'provider_avatar']) : null,
        'notifications' => fn() => $request->user() ? $request->user()->notifications()->get() : null,
        'projects' => fn() => $request->user() ? $request->user()->projects()->select(['title', 'projects.id', 'description', 'active'])->get() : null,
      ],
      'flash' => [
        'message' => fn() => $request->session()->get('message'),
        'status' => fn() => $request->session()->get('status'),
        'flash_key' => fn() => Str::uuid(),
      ],
    ]);
  }
}
