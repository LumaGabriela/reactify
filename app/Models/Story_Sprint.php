<?php
// app/Models/StorySprint.php
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

    public function story()
    {
        return $this->belongsTo(Story::class);
    }

    public function sprint()
    {
        return $this->belongsTo(Sprint::class);
    }
}