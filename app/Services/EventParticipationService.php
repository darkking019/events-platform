<?php

namespace App\Services;

use App\Models\Event;
use App\Models\User;

class EventParticipationService
{
    public function join(User $user, Event $event): void
    {
        $user->participatedEvents()
            ->syncWithoutDetaching([$event->id]);
    }

    public function leave(User $user, Event $event): void
    {
        $user->participatedEvents()
            ->detach($event->id);
    }
}
