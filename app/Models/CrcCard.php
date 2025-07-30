<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class CrcCard extends Model
{
    use HasFactory;

    protected $fillable = [
        'overall_model_id',
        'class_name',
        'responsibilities',
    ];

    public function overallModel()
    {
        return $this->belongsTo(OverallModel::class);
    }

    public function collaborators()
    {
        return $this->belongsToMany(CrcCard::class, 'crc_card_collaborator', 'crc_card_id', 'collaborator_id');
    }

    /**
     * The system interfaces that are associated with the CRC card.
     */
    public function systemInterfaces(): BelongsToMany
    {
        return $this->belongsToMany(SystemInterface::class, 'crc_card_system_interface');
    }
}

