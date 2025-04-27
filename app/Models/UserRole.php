<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class UserRole extends Model
{
    protected $fillable = [
        'name', 
        'user_role_id',
        'can_create',
        'can_read',
        'can_update'
    ];

    // Relação: Uma role pertence a vários usuários
    public function users(): HasMany
    {
        return $this->hasMany(User::class, 'user_role_id');
    }
}