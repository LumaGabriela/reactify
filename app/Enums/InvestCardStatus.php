<?php

namespace App\Enums;

enum InvestCardStatus: string
{
  case YES = 'yes';
  case NO = 'no';
  case NA = 'na';

  public function label(): string
  {
    return match ($this) {
      self::YES => 'Sim',
      self::NO => 'Não',
      self::NA => 'Não Aplicável',
    };
  }
}
