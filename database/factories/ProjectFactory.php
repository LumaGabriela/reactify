<?php

namespace Database\Factories;

use App\Models\Project;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Project>
 */
class ProjectFactory extends Factory
{
  /**
   * Define the model's default state.
   *
   * @return array<string, mixed>
   */
  protected $model = Project::class;

  public function definition(): array
  {
    return [
      'title' => $this->faker->randomElement(['Project Raccoon', 'Project Panda', 'Project Owl', 'Project Rat']),
      'description' => $this->faker->paragraph(),
      'active' => true,
      'status' => 'active',
      "created_at" => now(),
      "updated_at" => now(),
      "deleted_at" => null,
    ];
  }
}
