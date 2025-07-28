<?php

namespace App\Enums;

enum SprintStatus: string
{
    case PLANEJADO = 'planejado';
    case ATIVO = 'ativo';
    case CONCLUIDO = 'concluido';
}
