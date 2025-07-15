<?php

namespace App\Enums;

enum ProjectStatus: string
{
  case DRAFT = 'draft';
  case ACTIVE = 'active';
  case ON_HOLD = 'on_hold';
  case COMPLETED = 'completed';
  case ARCHIVED = 'archived';

  public function label(): string
  {
    return match ($this) {
      self::DRAFT => 'Draft',
      self::ACTIVE => 'Active',
      self::ON_HOLD => 'On Hold',
      self::COMPLETED => 'Completed',
      self::ARCHIVED => 'Archived',
    };
  }

  public function color(): string
  {
    return match ($this) {
      self::DRAFT => 'gray',
      self::ACTIVE => 'green',
      self::ON_HOLD => 'yellow',
      self::COMPLETED => 'blue',
      self::ARCHIVED => 'purple',
    };
  }

  public static function values(): array
  {
    return array_column(self::cases(), 'value');
  }
}
