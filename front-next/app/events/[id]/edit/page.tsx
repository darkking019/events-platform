"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export default function EditEventPage() {
  const router = useRouter();
  const { id: eventId } = useParams();

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("token")
      : null;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    city: "",
    is_public: true,
    image: null as File | null,
    items: [] as string[],
  });

  useEffect(() => {
    async function load() {
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const res = await fetch(
          `${API_URL}/api/events/event/${eventId}`,
          {
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) throw new Error();
        const { data } = await res.json();

        setFormData({
          title: data.title,
          description: data.description,
          date: data.date?.split("T")[0],
          city: data.city,
          is_public: !data.private,
          image: null,
          items: Array.isArray(data.items) ? data.items : [],
        });
      } catch {
        router.push("/dashboard");
      } finally {
        setLoading(false);
      }
    }

    if (eventId) load();
  }, [eventId, router, token]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    try {
      const payload = new FormData();
      payload.append("title", formData.title);
      payload.append("description", formData.description);
      payload.append("date", formData.date);
      payload.append("city", formData.city);
      payload.append("private", formData.is_public ? "0" : "1");
      payload.append("items", JSON.stringify(formData.items));

      if (formData.image) payload.append("image", formData.image);

      const res = await fetch(
        `${API_URL}/api/events/event/${eventId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: payload,
        }
      );

      if (res.ok) {
        router.push(`/events/${eventId}`);
      } else {
        alert("Erro ao atualizar evento");
      }
    } catch {
      alert("Erro de conexão");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <p className="text-center mt-10">Carregando...</p>;

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-6 space-y-6">
      <input
        value={formData.title}
        onChange={(e) =>
          setFormData({ ...formData, title: e.target.value })
        }
        className="w-full border p-2 rounded"
        placeholder="Título"
      />

      <button
        type="submit"
        disabled={submitting}
        className="px-6 py-3 bg-green-600 text-white rounded-lg"
      >
        {submitting ? "Salvando..." : "Salvar"}
      </button>
    </form>
  );
}
