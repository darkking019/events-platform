<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\Auth\LoginController;



Route::get('/', fn () => ['Laravel' => app()->version()]);

Route::middleware('auth')->group(function () {

    Route::get('/dashboard', function () {
        return response()->json([
            'message' => 'Bem-vindo ao dashboard',
            'user' => auth()->user(),
        ]);
    });
    

});


