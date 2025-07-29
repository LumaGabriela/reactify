<?php

namespace App\Models;

use App\Enums\InterfaceType;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SystemInterface extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'project_id',
        'title',
        'type',
        'input',
        'output',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'type' => InterfaceType::class,
    ];

    /**
     * Get the project that owns the interface.
     */
    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }
}
