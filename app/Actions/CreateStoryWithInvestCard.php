<?php

namespace App\Actions;

use App\Enums\InvestCardStatus;
use App\Models\Story;
use Illuminate\Support\Facades\DB;

class CreateStoryWithInvestCard
{
  /**
   * Create a new class instance.
   */
  public function __construct()
  {
    //
  }

  public function execute(array $data)
  {
    return DB::transaction(function () use ($data) {
      $story = Story::create([
        'title' => $data['title'],
        'type' => $data['type'],
        'project_id' => $data['project_id'],
      ]);

      $story->investCard()->create([
        'project_id' => $data['project_id'],
        'independent' => InvestCardStatus::NO,
        'negotiable' => InvestCardStatus::NO,
        'valuable' => InvestCardStatus::NO,
        'estimable' => InvestCardStatus::NO,
        'small' => InvestCardStatus::NO,
        'testable' => InvestCardStatus::NO,
      ]);

      return $story;
    });
  }
}
