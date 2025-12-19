<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ApiAuthTest extends TestCase
{
    use RefreshDatabase;

    private string $referer = 'http://localhost:8000';

    public function test_user_can_login_via_api(): void
    {
        $user = User::factory()->create([
            'email' => 'test@example.com',
            'password' => bcrypt('password'),
        ]);

        $this->withHeader('referer', $this->referer)->get('/sanctum/csrf-cookie');

        $response = $this->withHeader('referer', $this->referer)
                         ->postJson('/api/login', [
            'email' => 'test@example.com',
            'password' => 'password',
        ]);

        $response->assertOk()
                 ->assertJsonStructure([
                     'message',
                     'user' => ['id', 'name', 'email'],
                 ]);

        $this->assertAuthenticatedAs($user);
    }

    public function test_user_cannot_login_with_invalid_credentials(): void
    {
        $user = User::factory()->create();

        $this->withHeader('referer', $this->referer)->get('/sanctum/csrf-cookie');

        $response = $this->withHeader('referer', $this->referer)
                         ->postJson('/api/login', [
            'email' => $user->email,
            'password' => 'wrong-password',
        ]);

        $response->assertUnprocessable()
                 ->assertJsonValidationErrors(['email']);

        $this->assertGuest();
    }

   public function test_authenticated_user_can_logout_via_api(): void
{
    // ... login code ...

    $response = $this->withHeader('referer', 'http://localhost:8000')
                     ->postJson('/api/logout');

    $response->assertOk()
             ->assertJson(['message' => 'Logout realizado com sucesso']);

    $this->assertGuest('sanctum');  // <-- aqui
}
}