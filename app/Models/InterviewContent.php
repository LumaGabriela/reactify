<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class InterviewContent extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'interview_id',
        'transcript',
        'summary',
        'status',
    ];

    /**
     * Get the interview that this content belongs to.
     */
    public function interview(): BelongsTo
    {
        return $this->belongsTo(Interview::class);
    }
}