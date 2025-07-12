<?php

// @formatter:off
// phpcs:ignoreFile
/**
 * A helper file for your Eloquent Models
 * Copy the phpDocs from this file to the correct Model,
 * And remove them from this file, to prevent double declarations.
 *
 * @author Barry vd. Heuvel <barryvdh@gmail.com>
 */


namespace App\Models{
/**
 * 
 *
 * @property int $id
 * @property string $title
 * @property string $type
 * @property string $priority
 * @property int $project_id
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property \Illuminate\Support\Carbon|null $deleted_at
 * @property-read \App\Models\Project $project
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Goal newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Goal newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Goal onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Goal query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Goal whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Goal whereDeletedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Goal whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Goal wherePriority($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Goal whereProjectId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Goal whereTitle($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Goal whereType($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Goal whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Goal withTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Goal withoutTrashed()
 */
	class Goal extends \Eloquent {}
}

namespace App\Models{
/**
 * 
 *
 * @property int $id
 * @property string $title
 * @property array<array-key, mixed> $steps
 * @property int $project_id
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property \Illuminate\Support\Carbon|null $deleted_at
 * @property-read \App\Models\Project $project
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Journey newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Journey newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Journey onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Journey query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Journey whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Journey whereDeletedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Journey whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Journey whereProjectId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Journey whereSteps($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Journey whereTitle($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Journey whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Journey withTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Journey withoutTrashed()
 */
	class Journey extends \Eloquent {}
}

namespace App\Models{
/**
 * 
 *
 * @property int $id
 * @property string $name
 * @property array<array-key, mixed> $profile
 * @property array<array-key, mixed> $expectations
 * @property array<array-key, mixed> $goals
 * @property int $project_id
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property \Illuminate\Support\Carbon|null $deleted_at
 * @property-read \App\Models\Project $project
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Persona newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Persona newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Persona onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Persona query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Persona whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Persona whereDeletedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Persona whereExpectations($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Persona whereGoals($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Persona whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Persona whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Persona whereProfile($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Persona whereProjectId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Persona whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Persona withTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Persona withoutTrashed()
 */
	class Persona extends \Eloquent {}
}

namespace App\Models{
/**
 * 
 *
 * @property int $id
 * @property string|null $issues
 * @property string|null $solutions
 * @property string|null $personas
 * @property string|null $restrictions
 * @property string|null $product_is
 * @property string|null $product_is_not
 * @property int $project_id
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property \Illuminate\Support\Carbon|null $deleted_at
 * @property-read \App\Models\Project $project
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ProductCanvas newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ProductCanvas newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ProductCanvas onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ProductCanvas query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ProductCanvas whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ProductCanvas whereDeletedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ProductCanvas whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ProductCanvas whereIssues($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ProductCanvas wherePersonas($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ProductCanvas whereProductIs($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ProductCanvas whereProductIsNot($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ProductCanvas whereProjectId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ProductCanvas whereRestrictions($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ProductCanvas whereSolutions($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ProductCanvas whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ProductCanvas withTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ProductCanvas withoutTrashed()
 */
	class ProductCanvas extends \Eloquent {}
}

namespace App\Models{
/**
 * 
 *
 * @property int $id
 * @property string $title
 * @property string $description
 * @property bool $active
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property \Illuminate\Support\Carbon|null $deleted_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Goal> $goal_sketches
 * @property-read int|null $goal_sketches_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Journey> $journeys
 * @property-read int|null $journeys_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Persona> $personas
 * @property-read int|null $personas_count
 * @property-read \App\Models\ProductCanvas|null $product_canvas
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Story> $stories
 * @property-read int|null $stories_count
 * @property-read \App\Models\User|null $user
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\User> $users
 * @property-read int|null $users_count
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Project newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Project newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Project onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Project query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Project whereActive($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Project whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Project whereDeletedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Project whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Project whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Project whereTitle($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Project whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Project withTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Project withoutTrashed()
 */
	class Project extends \Eloquent {}
}

namespace App\Models{
/**
 * 
 *
 * @property int $id
 * @property string $title
 * @property string $type
 * @property int $project_id
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property \Illuminate\Support\Carbon|null $deleted_at
 * @property-read \App\Models\Project $project
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Story newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Story newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Story onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Story query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Story whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Story whereDeletedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Story whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Story whereProjectId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Story whereTitle($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Story whereType($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Story whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Story withTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Story withoutTrashed()
 */
	class Story extends \Eloquent {}
}

namespace App\Models{
/**
 * 
 *
 * @property int $id
 * @property string|null $provider_name
 * @property string|null $provider_id
 * @property string|null $provider_avatar
 * @property string $name
 * @property string $email
 * @property \Illuminate\Support\Carbon|null $email_verified_at
 * @property string|null $password
 * @property int $user_role_id
 * @property bool $active
 * @property string|null $remember_token
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property \Illuminate\Support\Carbon|null $deleted_at
 * @property-read \Illuminate\Notifications\DatabaseNotificationCollection<int, \Illuminate\Notifications\DatabaseNotification> $notifications
 * @property-read int|null $notifications_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Project> $projects
 * @property-read int|null $projects_count
 * @property-read \App\Models\UserRole $role
 * @method static \Database\Factories\UserFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereActive($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereDeletedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereEmail($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereEmailVerifiedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User wherePassword($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereProviderAvatar($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereProviderId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereProviderName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereRememberToken($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereUserRoleId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User withTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User withoutTrashed()
 */
	class User extends \Eloquent implements \Illuminate\Contracts\Auth\MustVerifyEmail {}
}

namespace App\Models{
/**
 * 
 *
 * @property int $id
 * @property int $user_id
 * @property int $project_id
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property string|null $deleted_at
 * @property string $role
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UserProject newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UserProject newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UserProject query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UserProject whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UserProject whereDeletedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UserProject whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UserProject whereProjectId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UserProject whereRole($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UserProject whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UserProject whereUserId($value)
 */
	class UserProject extends \Eloquent {}
}

namespace App\Models{
/**
 * 
 *
 * @property int $id
 * @property string $name
 * @property bool $can_create
 * @property bool $can_read
 * @property bool $can_update
 * @property \Illuminate\Support\Carbon|null $deleted_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\User> $users
 * @property-read int|null $users_count
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UserRole newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UserRole newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UserRole onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UserRole query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UserRole whereCanCreate($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UserRole whereCanRead($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UserRole whereCanUpdate($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UserRole whereDeletedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UserRole whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UserRole whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UserRole withTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UserRole withoutTrashed()
 */
	class UserRole extends \Eloquent {}
}

