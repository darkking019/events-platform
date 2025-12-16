<?php
use App\Http\Controllers\EventController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\EventParticipationController;
use App\Http\Controllers\DashboardController;
Route::post('/events/join/{event}', [EventParticipationController::class, 'join'])
    ->middleware('auth')
    ->name('events.join');
Route::delete('/events/{event}/leave', [EventParticipationController::class, 'leave'])
    ->middleware('auth')
    ->name('events.leave');
Route::get('/', [EventController::class, 'index']);
Route::get('/contact', [ContactController::class, 'contact'])
->name('contact');
Route::resource('events', EventController::class)
    ->middleware('auth');
Route::get('/dashboard', [DashboardController::class, 'dashboard'])
    ->middleware(['auth', 'verified'])
    ->name('dashboard');
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])
    ->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])
    ->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])
    ->name('profile.destroy');
});
require __DIR__.'/auth.php';
