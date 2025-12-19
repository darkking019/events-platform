<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class LoginController extends Controller
{
    public function store(Request $request)
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        if (!Auth::attempt($credentials)) {
            return response()->json([
                'errors' => [
                    'email' => ['Credenciais inválidas'],
                ],
            ], 422);
        }

        // Aqui o usuário está autenticado com sucesso
        $request->session()->regenerate();

        return response()->json([
            'message' => 'Login realizado com sucesso',
            'user' => Auth::user(),
        ], 200);
    }

    public function destroy(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json([
            'message' => 'Logout realizado com sucesso',
        ]);
    }
}
