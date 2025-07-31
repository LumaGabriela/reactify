<?php

use App\Http\Controllers\StoryController;
use App\Http\Controllers\GoalController;
use App\Http\Controllers\JourneyController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\PersonaController;
use App\Http\Controllers\ProductCanvasController;
use App\Http\Controllers\OverallModelController;
use App\Http\Controllers\OverallModelClassController;
use App\Http\Controllers\WelcomeEmailController;
use App\Http\Controllers\ProjectPermissionController;
use App\Http\Controllers\ProjectInvitationController;
use App\Http\Controllers\NotificationController;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Auth\Events\Registered;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

//rota para envio de email
Route::post('/email/welcome', [WelcomeEmailController::class, 'store'])->name('welcome-email.store');

//rotas de autorizacao com socialite
Route::get('/auth/{provider}/redirect', function (string $provider) {
  return Socialite::driver($provider)->redirect();
})->name('auth.redirect');

Route::get('/auth/{provider}/callback', function (string $provider) {
  $providerUser = Socialite::driver($provider)->user();

  $user = User::updateOrCreate(
    [
      'email' => $providerUser->email, // Verifica se o email já existe
    ],
    [
      'provider_id' => $providerUser->getId(),
      'name' => $providerUser->getName(),
      'provider_avatar' => $providerUser->getAvatar(),
      'provider_name' => $provider,
      'user_role_id' => 1,
      'active' => true,
      'email_verified_at' => now(),
    ]
  );

  Auth::login($user, true);

  return redirect()->intended(route('dashboard', absolute: false));
})->name('auth.callback');

//rotas para aceitar/recusar convites de projeto
Route::get('/invitations/{invitation:token}/accept', [ProjectInvitationController::class, 'accept'])->name('invitations.accept');

Route::get('/invitations/{invitation:token}/decline', [ProjectInvitationController::class, 'decline'])->name('invitations.decline');

// rotas para usuários autenticados
Route::group(['middleware' => ['auth', 'verified']], function () {
  Route::get('/dashboard', [ProjectController::class, 'index'])->name('dashboard');
  //rotas para projetos
  Route::prefix('project')->group(function () {
    Route::post('/create', [ProjectController::class, 'store'])->name('project.store');
    Route::get('/{project}/{page?}', [ProjectController::class, 'show'])->name('project.show');
    Route::patch('/{project}/members/add', [ProjectController::class, 'addNewMember'])->name('project.users.add');
    Route::patch('/{project}', [ProjectController::class, 'update'])->name('project.update');
    Route::patch('/{project}/toggle-active', [ProjectController::class, 'toggleActive'])->name('project.toggle-active');
    Route::delete('/{project}', [ProjectController::class, 'destroy'])->name('project.destroy');
  });
  //envia convite de projeto
  Route::post('/projects/{project}/invitations', [ProjectInvitationController::class, 'store'])->name('projects.invitations.store');

  // Rotas para stories
  Route::prefix('story')->group(function () {
    Route::post('/', [StoryController::class, 'store'])->name('story.store');
    Route::post('/bulk-store', [StoryController::class, 'bulk'])->name('story.bulk-store');
    Route::patch('/{story}', [StoryController::class, 'update'])->name('story.update');
    Route::delete('/{story}', [StoryController::class, 'destroy'])->name('story.delete');
  });

  //   Rotas para OverallModel
  Route::prefix('overall')->group(function () {
    Route::post('/', [OverallModelController::class, 'store'])->name('overall.store');
    Route::patch('/{overall}', [OverallModelController::class, 'update'])->name('overall.update');
    Route::delete('/{overall}', [OverallModelController::class, 'destroy'])->name('overall.delete');
  });

  Route::prefix('overall-model-classes')->group(function () {
    Route::post('/', [OverallModelClassController::class, 'store'])->name('overall-model-class.store');
    Route::delete('/{overall_model_class}', [OverallModelClassController::class, 'destroy'])->name('overall-model-class.delete');
  });

  //Rotas para goals
  Route::prefix('goal')->group(function () {
    Route::post('/', [GoalController::class, 'store'])->name('goal.store');
    Route::patch('/{goal}', [GoalController::class, 'update'])->name('goal.update');
    Route::delete('/{goal}', [GoalController::class, 'destroy'])->name('goal.delete');
  });
  //Rotas para journeys
  Route::prefix('journey')->group(function () {
    Route::post('/', [JourneyController::class, 'store'])->name('journey.store');
    Route::patch('/{journey}', [JourneyController::class, 'update'])->name('journey.update');
    Route::delete('/{journey}', [JourneyController::class, 'destroy'])->name('journey.delete');
    Route::post('/bulk-store', [JourneyController::class, 'bulk'])->name('journey.bulk-store');
  });
  Route::prefix('persona')->group(function () {
    Route::post('/', [PersonaController::class, 'store'])->name('persona.store');
    Route::patch('/{persona}', [PersonaController::class, 'update'])->name('persona.update');
    Route::delete('/{persona}', [PersonaController::class, 'destroy'])->name('persona.delete');
  });

  Route::prefix('product-canvas')->group(function () {
    Route::post('/', [ProductCanvasController::class, 'store'])->name('product-canvas.store');
    Route::patch('/{productCanvas}', [ProductCanvasController::class, 'update'])->name('product-canvas.update');
    Route::delete('/{productCanvas}', [ProductCanvasController::class, 'destroy'])->name('product-canvas.delete');
  });

  //pagina de notificacoes
  Route::prefix('notifications')->group(function () {
    Route::get('/', [NotificationController::class, 'index'])->name('notifications.index');
    Route::post('/', [NotificationController::class, 'store'])->name('notifications.store');
    Route::patch('/{notification}', [NotificationController::class, 'update'])->name('notifications.update');
    Route::delete('/{notification}', [NotificationController::class, 'destroy'])->name('notifications.delete');
  });
});

// rotas para gerenciar o perfil
Route::middleware('auth')->group(function () {
  Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
  Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
  Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::get('/config', function () {
  return Inertia::render('Config');
})
  ->middleware(['auth', 'verified'])
  ->name('config');

Route::get('/', function () {
  return Inertia::render('Welcome');
})
  ->middleware('guest')
  ->name('welcome');



// API routes that need session authentication
Route::prefix('api')
  ->middleware(['auth', 'verified'])
  ->group(function () {
    Route::get('/projects/{project}/permissions', [ProjectPermissionController::class, 'index'])->name(
      'api.project.permissions.index'
    );
    Route::post('/projects/{project}/permissions', [ProjectPermissionController::class, 'update'])->name(
      'api.projects.permissions.update'
    );
    Route::post('/projects/{project}/addMember', [ProjectPermissionController::class, 'addMember'])->name(
      'api.projects.permissions.addMember'
    );
    Route::post('/projects/{project}/removeMember', [ProjectPermissionController::class, 'removeMember'])->name(
      'api.projects.permissions.removeMember'
    );
  });

require __DIR__ . '/auth.php';
