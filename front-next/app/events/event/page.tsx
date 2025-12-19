"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

export default function EventPage() {
  const router = useRouter();
  const params = useParams();
  const eventId = params.id as string;

  const [user, setUser] = useState<any>(null);
  const [event, setEvent] = useState<any>(null);
  const [participants, setParticipants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        // Verifica autenticação
        const userRes = await fetch("http://localhost:8000/api/user", {
          credentials: "include",
          headers: { Accept: "application/json" },
        });

        if (!userRes.ok) throw new Error("401");

        const userData = await userRes.json();
        setUser(userData);

        // Busca o evento específico
        const eventRes = await fetch(`http://localhost:8000/api/events/${eventId}`, {
          credentials: "include",
          headers: { Accept: "application/json" },
        });

        if (!eventRes.ok) throw new Error("Evento não encontrado ou acesso negado");

        const eventData = await eventRes.json();
        setEvent(eventData);

        // Busca participantes
        const participantsRes = await fetch(
          `http://localhost:8000/api/events/${eventId}/participants`,
          {
            credentials: "include",
            headers: { Accept: "application/json" },
          }
        );

        if (participantsRes.ok) {
          const participantsData = await participantsRes.json();
          setParticipants(participantsData);
        }
      } catch (err) {
        router.push("/login");
      } finally {
        setLoading(false);
      }
    }

    if (eventId) load();
  }, [eventId, router]);

  async function handleDelete() {
    if (!confirm("Tem certeza que deseja excluir este evento permanentemente?")) {
      return;
    }

    try {
      await fetch("http://localhost:8000/sanctum/csrf-cookie", {
        credentials: "include",
      });

      const res = await fetch(`http://localhost:8000/api/events/${eventId}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        router.push("/dashboard");
      } else {
        alert("Erro ao excluir o evento.");
      }
    } catch {
      alert("Erro de conexão.");
    }
  }

  if (loading) return <p className="text-center mt-10">Carregando...</p>;

  if (!event) return <p className="text-center mt-10">Evento não encontrado.</p>;

  const isOwner = user?.id === event.user_id;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-4xl font-bold">{event.title}</h1>
          <p className="mt-2 text-lg text-gray-600">
            Detalhes do evento
          </p>
        </div>

        {isOwner && (
          <div className="flex gap-4">
            <button
              onClick={() => router.push(`/events/${eventId}/edit`)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Editar
            </button>

            <button
              onClick={handleDelete}
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Excluir
            </button>
          </div>
        )}
      </div>

      <div className="border rounded-lg p-6 mb-8 bg-gray-50">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm font-medium text-gray-500">Descrição</p>
            <p className="mt-1 text-lg">
              {event.description || "Sem descrição."}
            </p>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-500">Data e horário</p>
            <p className="mt-1 text-lg">
              {new Date(event.date).toLocaleDateString("pt-BR")} às {event.time}
            </p>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-500">Local</p>
            <p className="mt-1 text-lg">
              {event.location || "Não informado"}
            </p>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-500">Capacidade</p>
            <p className="mt-1 text-lg">
              {participants.length} / {event.capacity || "Sem limite"} participantes
            </p>
          </div>
        </div>
      </div>

      <div className="border rounded-lg p-6 bg-gray-50">
        <h2 className="text-2xl font-bold mb-4">
          Participantes ({participants.length})
        </h2>

        {participants.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {participants.map((participant: any, index: number) => (
              <div
                key={participant.id}
                className="border-l-4 border-indigo-600 pl-4 py-2"
              >
                <p className="font-medium">
                  {index + 1}. {participant.name}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">
            Ainda não há participantes confirmados.
          </p>
        )}
      </div>

      <div className="mt-8 text-center">
        <button
          onClick={() => router.push("/dashboard")}
          className="px-8 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
        >
          ← Voltar para meus eventos
        </button>
      </div>
    </div>
  );
}