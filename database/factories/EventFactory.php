<?php

namespace Database\Factories;

use App\Models\Event;
use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\User;
class EventFactory extends Factory
{
    protected $model = Event::class;

    public function definition(): array
    {
        return [
            'title' => $this->faker->sentence(),
            'description' => $this->faker->paragraph(), // ✅ Adicionado
            'city' => $this->faker->city(),
            'is_public' => true, // ou conforme sua policy
              'date' => $this->faker->date(),  // ✅ Adicionando o campo 'date'
               'private' => false,
               'user_id' => user::factory(), // ✅ Adiciona usuário automaticamente
        ];
    }
}


