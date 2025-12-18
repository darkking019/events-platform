<?php

namespace App\Policies;

use App\Models\Event;
use App\Models\User;

class EventPolicy
{
    /**
     * Qualquer usuário logado pode ver a lista de eventos
     */
    public function viewAny(?User $user): bool
    {
        return true;
    }

    /**
     * Qualquer usuário pode ver um evento público
     * Dono pode ver evento privado
     */
    public function view(?User $user, Event $event): bool
    {
        if (!$event->private) {
            return true;
        }

        return $user && $user->id === $event->user_id;
    }

    /**
     * Apenas usuários logados podem criar eventos
     */
   public function create(?User $user): bool
{
    return $user !== null;
}

    /**
     * Apenas o dono do evento pode atualizar
     */
   public function update(User $user, Event $event): bool
{
    return $user->id === $event->user_id;
}


    /**
     * Apenas o dono do evento pode deletar
     */
    public function leave(User $user, Event $event): bool
{
    return $user->participatedEvents()
        ->where('events.id', $event->id)
        ->exists();
}
 public function delete(User $user, Event $event): bool
    {
        return $user->id === $event->user_id;
    }

}

