<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use App\Models\User;
use Illuminate\Support\Facades\Hash;


class LoginController extends Controller
{
    /**
     * Realiza o login e retorna um token API
     */
    public function store(Request $request)
{
    $request->validate([
        'email' => ['required', 'email'],
        'password' => ['required'],
    ]);

    $user = User::where('email', $request->email)->first();

    if (! $user || ! Hash::check($request->password, $user->password)) {
        throw ValidationException::withMessages([
            'email' => ['Credenciais inválidas.'],
        ]);
    }

    // Revoga tokens antigos
    $user->tokens()->delete();

    // Cria token
    $token = $user->createToken('events-platform')->plainTextToken;

    return response()->json([
        'user' => $user,
        'token' => $token,
    ]);
}

    /**
     * Logout - revoga o token atual
     */
    public function destroy(Request $request)
    {
        // Revoga apenas o token que fez a requisição
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logout realizado com sucesso',
        ]);
    }
}