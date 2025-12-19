"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ContatosPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Tenta carregar o usuário logado (opcional – só pra mostrar nome se estiver logado)
  useEffect(() => {
    async function checkUser() {
      try {
        const res = await fetch("http://localhost:8000/api/user", {
          credentials: "include",
          headers: { Accept: "application/json" },
        });

        if (res.ok) {
          const userData = await res.json();
          setUser(userData);
        }
      } catch (err) {
        // Usuário não logado → tudo bem, página é pública
      } finally {
        setLoading(false);
      }
    }

    checkUser();
  }, []);

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

  if (loading) return <p className="text-center mt-10">Carregando...</p>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Cabeçalho com saudação opcional e botão de sair (só se logado) */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold">Contatos</h1>
          {user && (
            <p className="mt-2 text-lg text-gray-600">
              Olá novamente, <strong>{user.name}</strong>!
            </p>
          )}
          {!user && (
            <p className="mt-2 text-lg text-gray-600">
              Página pública – você não precisa estar logado para ver isso.
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

      {/* Seção de informações de contato */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {/* Card 1 - Email */}
        <div className="border rounded-lg p-6 bg-white shadow-sm hover:shadow-md transition">
          <div className="flex items-center mb-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="ml-4 text-xl font-semibold">E-mail</h3>
          </div>
          <p className="text-gray-700">contato@meuevento.com</p>
          <p className="text-sm text-gray-500 mt-2">Resposta em até 24 horas</p>
        </div>

        {/* Card 2 - Telefone/WhatsApp */}
        <div className="border rounded-lg p-6 bg-white shadow-sm hover:shadow-md transition">
          <div className="flex items-center mb-4">
            <div className="p-3 bg-green-100 rounded-full">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <h3 className="ml-4 text-xl font-semibold">Telefone / WhatsApp</h3>
          </div>
          <p className="text-gray-700">(11) 98765-4321</p>
          <p className="text-sm text-gray-500 mt-2">Segunda a sexta, 9h às 18h</p>
        </div>

        {/* Card 3 - Endereço */}
        <div className="border rounded-lg p-6 bg-white shadow-sm hover:shadow-md transition">
          <div className="flex items-center mb-4">
            <div className="p-3 bg-purple-100 rounded-full">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="ml-4 text-xl font-semibold">Endereço</h3>
          </div>
          <p className="text-gray-700">Rua Exemplo, 123<br />São Paulo - SP<br />CEP: 01234-567</p>
        </div>
      </div>

      {/* Mensagem adicional */}
      <div className="mt-12 text-center">
        <p className="text-lg text-gray-700 max-w-3xl mx-auto">
          Estamos aqui para ajudar com dúvidas sobre eventos, inscrições, suporte técnico ou qualquer outra questão.
          Entre em contato pelo meio que preferir!
        </p>

        {user && (
          <button
            onClick={() => router.push("/dashboard")}
            className="mt-8 px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Voltar para meus eventos
          </button>
        )}

        {!user && (
          <div className="mt-8 space-x-4">
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