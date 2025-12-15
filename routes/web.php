<?php
use App\Http\Controllers\EventController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use App\Models\Event;
//Route::get('/', function () {
  //  return view('welcome');
//});

/*Route::get('/', function (Illuminate\Http\Request $request) {
    $search = $request->query('search');
    return view('welcome', ['search' => $search]);
});*/
Route::get('/', [EventController::class, 'index']);


Route::get('/contact', [ContactController::class, 'contact'])
->name('contact');




Route::resource('events', EventController::class)
    ->middleware('auth');


Route::get('/dashboard', [EventController::class, 'dashboard'])
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
