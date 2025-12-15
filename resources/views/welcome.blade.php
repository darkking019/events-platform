@extends('Layouts.main')
@section('title', 'HDC Events')
@section('content')
  
<div id="search-container" class="col-md-12">
@if ($search)
      <h3>buscando por: {{ $search }}</h3>
      @else
<h1>Busque um evento</h1>
@endif
<form action="/" method="GET">
            <input type="text" id="search" name="search" class="form-control" placeholder="Procurar...">
         </form>
      </div>
      <div id="events-container" class="col-md-12">
         <h2>proximos eventos</h2>
         <p class="subtitle">Veja os eventos dos próximos dias</p>
         <div id="cards-container" class="row">
            @foreach ($events as $event)
               <div class="card col_md3">
                  <img src="/img/imagemevento2.jpg" alt="$event->title">
                  <div class="card-body">
                     <p class="card-date">10/12/2025</p>
                     <h5 class="card-title">{{ $event->title }}
                     </h5>
                     <p class="card-participants">{{count($event->participants)}}</p>
                     <a href="/events/{{ $event->id }}" class="btn btn-primary">saber mais</a>
                  </div>
               </div>
            @endforeach
            @if (count($events) == 0 && $search)
            <p>nao foi possivel encontrar nenhum evento com {{ $search }}!! <a href="/">Ver todos</a></p>
            
            @endif
         </div>
      </div>
@endsection