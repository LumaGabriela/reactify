<?php

namespace App\Enums;

enum StoryBacklogStatus: string
{
    case PRODUCT_BACKLOG = 'product_backlog';
    case SPRINT_BACKLOG = 'sprint_backlog';
    case DELIVERED = 'delivered';
}
