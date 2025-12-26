"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export default function ContatosPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("token")
      : null;

  // 🔹 Usuário logado (opcional, stateless)
  useEffect(() => {
    async function checkUser() {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${API_URL}/api/user`, {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const userData = await res.json();
          setUser(userData);
        } else {
          localStorage.removeItem("token");
        }
      } catch {
        localStorage.removeItem("token");
      } finally {
        setLoading(false);
      }
    }

    checkUser();
  }, [token]);

  // 🔹 Logout (client-side)
  function logout() {
    localStorage.removeItem("token");
    router.push("/login");
  }

  if (loading) {
    return <p className="text-center mt-10">Carregando...</p>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Cabeçalho */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold">Contatos</h1>

          {user ? (
            <p className="mt-2 text-lg text-gray-600">
              Olá novamente, <strong>{user.name}</strong>!
            </p>
          ) : (
            <p className="mt-2 text-lg text-gray-600">
              Página pública – você não precisa estar logado.
            </p>
          )}
        </div>

        {user && (
          <button
            onClick={logout}
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Sair
          </button>
        )}
      </div>

      {/* Cards */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <div className="border rounded-lg p-6 bg-white shadow-sm">
          <h3 className="text-xl font-semibold mb-2">E-mail</h3>
          <p className="text-gray-700">contato@meuevento.com</p>
        </div>

        <div className="border rounded-lg p-6 bg-white shadow-sm">
          <h3 className="text-xl font-semibold mb-2">
            Telefone / WhatsApp
          </h3>
          <p className="text-gray-700">(11) 98765-4321</p>
        </div>

        <div className="border rounded-lg p-6 bg-white shadow-sm">
          <h3 className="text-xl font-semibold mb-2">Endereço</h3>
          <p className="text-gray-700">
            Rua Exemplo, 123<br />
            São Paulo – SP
          </p>
        </div>
      </div>

      {/* Ações finais */}
      <div className="mt-12 text-center">
        {user ? (
          <button
            onClick={() => router.push("/dashboard")}
            className="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Voltar para meus eventos
          </button>
        ) : (
          <div className="space-x-4">
            <button
              onClick={() => router.push("/login")}
              className="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Fazer login
            </button>
            <button
              onClick={() => router.push("/register")}
              className="px-8 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              Criar conta
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
