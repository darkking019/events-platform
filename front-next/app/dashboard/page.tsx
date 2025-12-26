"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any | null>(null);
  const [events, setEvents] = useState<any[]>([]);
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

        if (!userRes.ok) throw new Error("401");

        const userData = await userRes.json();
        setUser(userData);

        // 📅 eventos do dashboard
        const eventsRes = await fetch(`${API_URL}/api/events`, {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!eventsRes.ok) throw new Error("Erro ao carregar eventos");

        const eventsJson = await eventsRes.json();
        setEvents(eventsJson.data ?? []);
      } catch {
        localStorage.removeItem("token");
        router.push("/login");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [router, token]);

  function logout() {
    localStorage.removeItem("token");
    router.push("/login");
  }

  if (loading) {
    return <p className="text-center mt-10">Carregando...</p>;
  }

  if (!user) {
    return <p className="text-center mt-10">Usuário não autenticado</p>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between mb-8">
        <h1 className="text-4xl font-bold">Meus eventos</h1>
        <button
          onClick={logout}
          className="px-6 py-3 bg-red-600 text-white rounded-lg"
        >
          Sair
        </button>
      </div>

      <p className="mb-6">
        Bem-vindo, <strong>{user.name}</strong>
      </p>

      {events.length ? (
        <div className="grid gap-6 md:grid-cols-3">
          {events.map((event) => (
            <div
              key={event.id}
              className="border p-4 rounded cursor-pointer hover:bg-gray-50"
              onClick={() => router.push(`/events/${event.id}`)}
            >
              <h3 className="font-bold">{event.title}</h3>
            </div>
          ))}
        </div>
      ) : (
        <p>Você não tem eventos ainda.</p>
      )}
    </div>
  );
}
