<?php

namespace Tests\Unit;

use App\Models\User;
use App\Models\Event;
use App\Services\EventParticipationService;
use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;

class EventParticipationServiceTest extends TestCase
{
    use RefreshDatabase;

    /** Testa se join adiciona evento ao usuário em memória */
    public function test_join_adds_event_to_user_in_memory()
    {
        $user = User::factory()->make();   // só memória
        $event = Event::factory()->make(); // só memória

        $service = new EventParticipationService();
        $service->join($user, $event);

        $this->assertContains($event->id, $user->participatedEvents->pluck('id')->toArray());
    }

    /** Testa se join persiste evento no banco */
    public function test_join_adds_event_to_user_in_database()
    {
        $user = User::factory()->create();
        $event = Event::factory()->create();

        $service = new EventParticipationService();
        $service->join($user, $event);

        $this->assertDatabaseHas('event_user', [
            'user_id' => $user->id,
            'event_id' => $event->id,
        ]);
    }
}
