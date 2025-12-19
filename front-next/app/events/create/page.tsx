"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateEventPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    city: "",
    is_public: true, // true = público, false = privado
    image: null as File | null,
    items: [] as string[],
  });

  const [newItem, setNewItem] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Verifica autenticação via proxy
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/user", {
          credentials: "include",
          headers: { Accept: "application/json" },
        });

        if (!res.ok) throw new Error("Não autenticado");

        const userData = await res.json();
        setUser(userData);
      } catch {
        router.push("/login");
      } finally {
        setLoading(false);
      }
    }

    checkAuth();
  }, [router]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined;

    setFormData((prev) => ({
      ...prev,
      [name]: checked !== undefined ? checked : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFormData((prev) => ({ ...prev, image: e.target.files![0] }));
    }
  };

  const addItem = () => {
    if (newItem.trim()) {
      setFormData((prev) => ({ ...prev, items: [...prev.items, newItem.trim()] }));
      setNewItem("");
    }
  };

  const removeItem = (index: number) => {
    setFormData((prev) => ({ ...prev, items: prev.items.filter((_, i) => i !== index) }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = "O título é obrigatório";
    if (!formData.description.trim()) newErrors.description = "A descrição é obrigatória";
    if (!formData.date) newErrors.date = "A data é obrigatória";
    if (!formData.city.trim()) newErrors.city = "A cidade é obrigatória";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);

    try {
      // Pega o CSRF cookie via proxy
      await fetch("/sanctum/csrf-cookie", {
        credentials: "include",
      });

      const payload = new FormData();
      payload.append("title", formData.title);
      payload.append("description", formData.description);
      payload.append("date", formData.date);
      payload.append("city", formData.city);

      // Seu banco usa 'private' (boolean)
      // Se o checkbox "Evento público?" estiver marcado → private = 0 (público)
      // Se não → private = 1 (privado)
      payload.append("private", formData.is_public ? "0" : "1");

      payload.append("items", JSON.stringify(formData.items));

      if (formData.image) {
        payload.append("image", formData.image);
      }

      const res = await fetch("/api/events", {
        method: "POST",
        credentials: "include",
        body: payload,
      });

      if (res.ok) {
        alert("Evento criado com sucesso!");
        router.push("/dashboard");
      } else {
        let msg = "Erro ao criar evento.";
        try {
          const data = await res.json();
          if (data.message) msg = data.message;
          if (data.errors) setErrors(data.errors);
        } catch {}
        alert(`${msg} (Status: ${res.status})`);
      }
    } catch (err) {
      console.error(err);
      alert("Erro de conexão. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <p className="text-xl">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-4xl font-bold">Criar novo evento</h1>
          <p className="mt-2 text-lg text-gray-600">Preencha os detalhes abaixo</p>
        </div>

        <button
          onClick={() => router.push("/dashboard")}
          className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
        >
          Voltar
        </button>
      </div>

      <p className="mb-8">
        Olá, <strong>{user?.name || "Usuário"}</strong>!
      </p>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Título do evento</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ex: Churrasco de Final de Ano"
            />
            {errors.title && <p className="text-red-600 text-sm mt-1">{errors.title}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Cidade</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ex: Belo Horizonte"
            />
            {errors.city && <p className="text-red-600 text-sm mt-1">{errors.city}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Descrição</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={5}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Conte tudo sobre o evento..."
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
            <label className="block text-sm font-medium mb-2">Imagem do evento (opcional)</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full px-4 py-2 border rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700"
            />
            {formData.image && (
              <p className="text-sm text-gray-600 mt-2">
                Imagem selecionada: <strong>{formData.image.name}</strong>
              </p>
            )}
          </div>
        </div>

        <div>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="is_public"
              checked={formData.is_public}
              onChange={handleChange}
              className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
            />
            <span className="text-lg font-medium">Evento público?</span>
          </label>
          <p className="text-sm text-gray-600 mt-2">
            {formData.is_public
              ? "Todos podem ver e participar"
              : "Apenas convidados podem ver e participar"}
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Itens que os convidados podem levar (opcional)
          </label>
          <div className="flex gap-3 mb-4">
            <input
              type="text"
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addItem())}
              className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ex: Cerveja, refrigerante..."
            />
            <button
              type="button"
              onClick={addItem}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Adicionar
            </button>
          </div>

          {formData.items.length > 0 && (
            <div className="space-y-2">
              {formData.items.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center bg-gray-100 px-4 py-3 rounded-lg"
                >
                  <span>{item}</span>
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="text-red-600 hover:text-red-800 font-medium"
                  >
                    Remover
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-4 pt-6">
          <button
            type="button"
            onClick={() => router.push("/dashboard")}
            className="px-8 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-10 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {submitting ? "Criando..." : "Criar evento"}
          </button>
        </div>
      </form>
    </div>
  );
}