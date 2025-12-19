"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const userRes = await fetch("http://localhost:8000/api/user", {
          credentials: "include",
          headers: { Accept: "application/json" },
        });

        if (!userRes.ok) throw new Error("401");

        const userData = await userRes.json();
        setUser(userData);

        const eventsRes = await fetch("http://localhost:8000/api/my-events", {
          credentials: "include",
          headers: { Accept: "application/json" },
        });

        if (eventsRes.ok) {
          setEvents(await eventsRes.json());
        }
      } catch {
        router.push("/login");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [router]);

  async function logout() {
    await fetch("http://localhost:8000/sanctum/csrf-cookie", {
      credentials: "include",
    });

    await fetch("http://localhost:8000/api/logout", {
      method: "POST",
      credentials: "include",
    });

    router.push("/login");
  }

  if (loading) return <p>Carregando...</p>;

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
            <div key={event.id} className="border p-4 rounded">
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
