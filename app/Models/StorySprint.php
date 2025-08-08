<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;

class StorySprint extends Pivot
{
    protected $table = 'story_sprint';
    
    protected $fillable = [
        'story_id',
        'sprint_id', 
        'kanban_status',
        'position'
    ];

    protected $casts = [
        'position' => 'integer'
    ];

    public function story()
    {
        return $this->belongsTo(Story::class);
    }

    public function sprint()
    {
        return $this->belongsTo(Sprint::class);
    }

    /**
     * Scope para stories em uma coluna específica do Kanban
     */
    public function scopeInKanbanColumn($query, $status)
    {
        return $query->where('kanban_status', $status);
    }

    /**
     * Scope para ordenar por posição
     */
    public function scopeOrderedByPosition($query)
    {
        return $query->orderBy('position');
    }
}