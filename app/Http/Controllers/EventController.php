<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Http\Requests\StoreEventRequest;
use App\Http\Requests\UpdateEventRequest;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class EventController extends Controller
{
    use AuthorizesRequests;

   public function index(Request $request)
    {
        $search = $request->query('search');

        $query = Event::query();

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'LIKE', "%{$search}%")
                  ->orWhere('city', 'LIKE', "%{$search}%");
            });
        }

        $events = $query->latest()->paginate(10);

        return view('welcome', compact('events', 'search'));
    }
/*public function index(Request $request) {

    $search = $request->input('search');

    if ($search) {
        $events = Event::where([
            ['title', 'like', '%' . $search . '%']
        ])->get();
    } else {
        $events = Event::all();
    }

    return view('welcome', [
        'events' => $events,
        'search' => $search
    ]);
}*/





  public function show(Event $event)
{
    $this->authorize('view', $event);

    $event->load('participants', 'user');

    $hasUserJoined = false;

    if (auth()->check()) {
            $hasUserJoined = $event->participants()
    ->where('user_id', auth()->id())
    ->exists();

    }

    return view('events.show', compact('event', 'hasUserJoined'));
}



    public function create()
    {
        $this->authorize('create', Event::class);

        return view('events.create');
    }

    public function store(StoreEventRequest $request)
    {
        $data = $request->validated();

        if ($request->hasFile('image') && $request->file('image')->isValid()) {
            $data['image'] = $request->image->store('events', 'public');
        }

        $event = auth()->user()->events()->create($data);

        return redirect()
            ->route('events.show', $event)
            ->with('msg', 'Evento criado com sucesso!');

    }

    public function edit(Event $event)
    {
        $this->authorize('update', $event);

        return view('events.edit', compact('event'));
    }

    public function update(UpdateEventRequest $request, Event $event)
    {
        $this->authorize('update', $event);

        $data = $request->validated();

        if ($request->hasFile('image') && $request->file('image')->isValid()) {
            // Apaga imagem antiga se existir
            if ($event->image) {
                Storage::disk('public')->delete($event->image);
            }
            $data['image'] = $request->image->store('events', 'public');
        }

        $event->update($data);

        return redirect()
            ->route('events.show', $event)
            ->with('msg', 'Evento atualizado com sucesso!');
    }

    public function destroy(Event $event)
    {
        $this->authorize('delete', $event);

        // Apaga imagem do storage
        if ($event->image) {
            Storage::disk('public')->delete($event->image);
        }

        $event->delete();

        return redirect()
            ->route('dashboard')
            ->with('msg', 'Evento excluído com sucesso!');
    }

public function dashboard()
{
    $user = auth()->user();

    $createdEvents = Event::where('user_id', $user->id)
        ->latest()
        ->get();

    $participatedEvents = Event::whereHas('participants', function ($q) use ($user) {
        $q->where('user_id', $user->id);
    })
    ->latest()
    ->get();

    return view('events.dashboard', compact('createdEvents', 'participatedEvents'));

}



public function joinEvent(Event $event)
{
    $this->authorize('view', $event); // só entra se for público ou dono

   //auth()->user()->participatedEvents()->attach($event->id);
    auth()->user()->participatedEvents()->syncWithoutDetaching([$event->id]);


    return back()->with('msg', 'Você entrou no evento com sucesso!');
}

public function leaveEvent(Event $event)
{
    auth()->user()->participatedEvents()->detach($event->id);

    return back()->with('msg', 'Você saiu do evento.');
}

}