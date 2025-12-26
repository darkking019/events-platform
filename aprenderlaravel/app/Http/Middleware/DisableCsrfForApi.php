<?php



// app/Http/Middleware/DisableCsrfForApi.php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class DisableCsrfForApi
{
    public function handle(Request $request, Closure $next)
    {
        // Ignora CSRF se a rota começar com /api
        if ($request->is('api/*')) {
            $request->session()->forget('_token');
        }

        return $next($request);
    }
}
