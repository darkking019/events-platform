"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export default function EventPage() {
  const router = useRouter();
  const params = useParams();
  const eventId = params.id as string;

  const [user, setUser] = useState<any>(null);
  const [event, setEvent] = useState<any>(null);
  const [participants, setParticipants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("token")
      : null;

  useEffect(() => {
    async function load() {
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        // 👤 usuário autenticado
        const userRes = await fetch(`${API_URL}/api/user`, {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!userRes.ok) throw new Error("Não autenticado");

        const userData = await userRes.json();
        setUser(userData);

        // 📅 evento
        const eventRes = await fetch(
          `${API_URL}/api/events/event/${eventId}`,
          {
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!eventRes.ok) throw new Error("Evento não encontrado");

        const eventData = await eventRes.json();

        setEvent({
          ...eventData.data,
          items: Array.isArray(eventData.data.items)
            ? eventData.data.items
            : [],
        });

        // 👥 participantes
        const participantsRes = await fetch(
          `${API_URL}/api/events/event/${eventId}/participants`,
          {
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (participantsRes.ok) {
          const participantsData = await participantsRes.json();
          setParticipants(participantsData.data ?? []);
        }
      } catch (err) {
        console.error(err);
        localStorage.removeItem("token");
        router.push("/login");
      } finally {
        setLoading(false);
      }
    }

    if (eventId) load();
  }, [eventId, router, token]);

  async function handleDelete() {
    if (!confirm("Tem certeza que deseja excluir este evento?")) return;

    try {
      const res = await fetch(
        `${API_URL}/api/events/event/${eventId}`,
        {
          method: "DELETE",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.ok) {
        router.push("/dashboard");
      } else {
        alert("Erro ao excluir evento.");
      }
    } catch (err) {
      console.error(err);
      alert("Erro de conexão.");
    }
  }

  if (loading)
    return (
      <p className="text-center mt-10 text-lg">
        Carregando evento...
      </p>
    );

  if (!event)
    return (
      <p className="text-center mt-10 text-lg">
        Evento não encontrado.
      </p>
    );

  const isOwner = user?.id === event.user_id;

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Banner */}
      <div className="mb-10">
        {event.image_url ? (
          <img
            src={event.image_url}
            alt={event.title}
            className="w-full h-64 md:h-96 object-cover rounded-2xl shadow-2xl"
          />
        ) : (
          <div className="w-full h-64 md:h-96 bg-gray-200 rounded-2xl flex items-center justify-center">
            <span className="text-gray-500 text-xl">
              Sem imagem de capa
            </span>
          </div>
        )}
      </div>

      {/* Cabeçalho */}
      <div className="flex justify-between mb-10">
        <div>
          <h1 className="text-4xl font-bold">{event.title}</h1>
          <p className="text-gray-600 mt-2">
            {event.private ? "Evento privado" : "Evento público"}
          </p>
        </div>

        {isOwner && (
          <div className="flex gap-4">
            <button
              onClick={() =>
                router.push(`/events/${eventId}/edit`)
              }
              className="px-6 py-3 bg-blue-600 text-white rounded-lg"
            >
              Editar
            </button>
            <button
              onClick={handleDelete}
              className="px-6 py-3 bg-red-600 text-white rounded-lg"
            >
              Excluir
            </button>
          </div>
        )}
      </div>

      {/* Participantes */}
      <div className="border rounded-xl p-6 bg-white">
        <h2 className="text-2xl font-bold mb-4">
          Participantes ({participants.length})
        </h2>

        {participants.length ? (
          <ul className="space-y-2">
            {participants.map((p: any) => (
              <li key={p.id}>{p.name}</li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">
            Nenhum participante ainda.
          </p>
        )}
      </div>

      <div className="mt-10 text-center">
        <button
          onClick={() => router.push("/dashboard")}
          className="px-8 py-3 bg-gray-800 text-white rounded-lg"
        >
          ← Voltar para o dashboard
        </button>
      </div>
    </div>
  );
}
