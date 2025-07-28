<?php

namespace App\Enums;

enum ChangeRequestStatus: string
{
    case SOLICITADA = 'solicitada';
    case EM_ANALISE = 'em_analise';
    case APROVADA = 'aprovada';
    case REJEITADA = 'rejeitada';
}
