"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

export default function EditEventPage() {
  const router = useRouter();
  const params = useParams();
  const eventId = params.id as string;

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [fetchingEvent, setFetchingEvent] = useState(true);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    city: "",
    capacity: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Carrega usuário autenticado
  useEffect(() => {
    async function checkAuth() {
      try {
        const userRes = await fetch("http://localhost:8000/api/user", {
          credentials: "include",
          headers: { Accept: "application/json" },
        });

        if (!userRes.ok) throw new Error("401");

        const userData = await userRes.json();
        setUser(userData);
      } catch {
        router.push("/login");
      } finally {
        setLoading(false);
      }
    }

    checkAuth();
  }, [router]);

  // Carrega os dados do evento
  useEffect(() => {
    async function loadEvent() {
      if (!eventId) return;

      try {
        const res = await fetch(`http://localhost:8000/api/events/${eventId}`, {
          credentials: "include",
          headers: { Accept: "application/json" },
        });

        if (!res.ok) {
          if (res.status === 403 || res.status === 404) {
            alert("Você não tem permissão para editar este evento.");
            router.push("/dashboard");
            return;
          }
          throw new Error("Erro ao carregar evento");
        }

        const eventData = await res.json();

        // Preenche o formulário com os dados atuais
        setFormData({
          title: eventData.title || "",
          description: eventData.description || "",
          date: eventData.date || "",
          time: eventData.time || "",
          location: eventData.location || "",
          city: eventData.city || "",
          capacity: eventData.capacity || "",
        });
      } catch (err) {
        console.error(err);
        alert("Erro ao carregar os dados do evento.");
        router.push("/dashboard");
      } finally {
        setFetchingEvent(false);
      }
    }

    if (!loading) {
      loadEvent();
    }
  }, [eventId, loading, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = "O título é obrigatório";
    if (!formData.description.trim()) newErrors.description = "A descrição é obrigatória";
    if (!formData.date) newErrors.date = "A data é obrigatória";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setSubmitting(true);

    try {
      await fetch("http://localhost:8000/sanctum/csrf-cookie", {
        credentials: "include",
      });

      const res = await fetch(`http://localhost:8000/api/events/${eventId}`, {
        method: "PUT", // ou "PATCH" se preferir
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          date: formData.date,
          time: formData.time,
          location: formData.location,
          city: formData.city,
          capacity: formData.capacity ? Number(formData.capacity) : null,
        }),
      });

      if (res.ok) {
        alert("Evento atualizado com sucesso!");
        router.push("/dashboard");
      } else {
        const data = await res.json();
        if (data.errors) {
          setErrors(data.errors);
        } else {
          alert("Erro ao salvar as alterações.");
        }
      }
    } catch (err) {
      console.error(err);
      alert("Erro de conexão. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleBack = () => {
    router.push("/dashboard");
  };

  if (loading || fetchingEvent) {
    return <p className="text-center mt-10">Carregando...</p>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Editar evento</h1>
        <button
          onClick={handleBack}
          className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
        >
          Voltar
        </button>
      </div>

      <p className="mb-8">
        Olá, <strong>{user?.name}</strong>! Atualize as informações do seu evento.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Título do evento</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ex: Festa de Aniversário"
          />
          {errors.title && <p className="text-red-600 text-sm mt-1">{errors.title}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Descrição</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Descreva o evento..."
          />
          {errors.description && <p className="text-red-600 text-sm mt-1">{errors.description}</p>}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Data</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.date && <p className="text-red-600 text-sm mt-1">{errors.date}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Horário</label>
            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.time && <p className="text-red-600 text-sm mt-1">{errors.time}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Local</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ex: Salão de festas do condomínio"
          />
          {errors.location && <p className="text-red-600 text-sm mt-1">{errors.location}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Cidade</label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ex: São Paulo"
          />
          {errors.city && <p className="text-red-600 text-sm mt-1">{errors.city}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Capacidade máxima</label>
          <input
            type="number"
            name="capacity"
            value={formData.capacity}
            onChange={handleChange}
            min="1"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ex: 50 (deixe vazio para ilimitado)"
          />
          {errors.capacity && <p className="text-red-600 text-sm mt-1">{errors.capacity}</p>}
        </div>

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={handleBack}
            className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-70"
          >
            {submitting ? "Salvando..." : "Salvar alterações"}
          </button>
        </div>
      </form>
    </div>
  );
}