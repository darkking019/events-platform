<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use App\Models\User;

class Event extends Model
{
    protected $fillable = [
        'title',
        'description',
        'date',
        'city',
        'private',
        'image',
        'items',
        'user_id',
    ];

    protected $casts = [
        'items' => 'array',
        'private' => 'boolean',
        'date' => 'date', // mude para 'datetime' se o campo tiver hora
    ];

    /**
     * O usuário dono do evento
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Usuários participantes do evento (muitos-para-muitos)
     */
    public function participants(): BelongsToMany
{
    return $this->belongsToMany(User::class, 'event_user')
        ->withTimestamps()
        ->orderBy('name');
}

    /**
     * Verifica se um usuário específico está participando do evento
     */
    public function hasUser(User $user): bool
    {
        return $this->users()->where('user_id', $user->id)->exists();
    }
   
    
}

