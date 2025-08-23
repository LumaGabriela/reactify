<?php

namespace App\Enums;

enum ProjectStatus: string
{
  case ACTIVE = 'active';
  case COMPLETED = 'completed';
  case ARCHIVED = 'archived';

  public function label(): string
  {
    return match ($this) {
      self::ACTIVE => 'Active',
      self::COMPLETED => 'Completed',
      self::ARCHIVED => 'Archived',
    };
  }

  public function color(): string
  {
    return match ($this) {
      self::ACTIVE => 'green',
      self::COMPLETED => 'blue',
      self::ARCHIVED => 'purple',
    };
  }

  public static function values(): array
  {
    return array_column(self::cases(), 'value');
  }
}
