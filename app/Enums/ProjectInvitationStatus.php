<?php

namespace App\Enums;

enum ProjectInvitationStatus: string
{
  case PENDING = 'pending';
  case ACCEPTED = 'accepted';
  case REJECTED = 'rejected';
  case EXPIRED = 'expired';

  public function label(): string
  {
    return match ($this) {
      self::PENDING => 'Pending',
      self::ACCEPTED => 'Accepted',
      self::REJECTED => 'Rejected',
      self::EXPIRED => 'Expired',
    };
  }

  public function color(): string
  {
    return match ($this) {
      self::PENDING => 'yellow',
      self::ACCEPTED => 'green',
      self::REJECTED => 'red',
      self::EXPIRED => 'gray',
    };
  }

  public static function values(): array
  {
    return array_column(self::cases(), 'value');
  }
}
