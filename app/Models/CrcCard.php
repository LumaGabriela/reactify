<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

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
}

