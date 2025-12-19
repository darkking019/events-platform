<?php

use App\Http\Controllers\Api\LoginController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\EventController;
Route::post('/login', [LoginController::class, 'store']);


Route::middleware('auth:sanctum')->get('/user', function () {
    return auth()->user();
});


Route::middleware('auth:sanctum')->group(function () {
    Route::get('/my-events', [EventController::class, 'index']);
    Route::post('/events', [EventController::class, 'store']);
});