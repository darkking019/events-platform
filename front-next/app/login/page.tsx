"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import Input from "@/app/components/ui/input";
import Button from "@/app/components/ui/Button";

/**
 * Lê cookie pelo nome
 */
function getCookie(name: string): string | undefined {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift();
}

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      /**
       * 1️⃣ Pede o cookie CSRF do Sanctum
       */
      const csrfRes = await fetch(
        "http://localhost:8000/sanctum/csrf-cookie",
        {
          credentials: "include",
        }
      );

      if (!csrfRes.ok) {
        throw new Error("Falha ao obter cookie CSRF");
      }

      const xsrfToken = getCookie("XSRF-TOKEN");
      if (!xsrfToken) {
        throw new Error("Token XSRF não encontrado");
      }

      /**
       * 2️⃣ Dados do formulário
       */
      const form = e.target as HTMLFormElement;
      const formData = new FormData(form);

      const email = String(formData.get("email") || "").trim();
      const password = String(formData.get("password") || "");

      if (!email || !password) {
        setError("Preencha email e senha");
        setLoading(false);
        return;
      }

      /**
       * 3️⃣ LOGIN REAL (ROTA CORRETA)
       * 🔥 /login (NÃO /api/login)
       */
      const loginRes = await fetch("http://localhost:8000/login", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-XSRF-TOKEN": decodeURIComponent(xsrfToken),
        },
        body: JSON.stringify({ email, password }),
      });

      if (!loginRes.ok) {
        const data = await loginRes.json().catch(() => ({}));
        setError(
          data.errors?.email?.[0] ||
            data.message ||
            "Email ou senha inválidos"
        );
        setLoading(false);
        return;
      }

      /**
       * 4️⃣ Login OK
       */
      const loginData = await loginRes.json();
      console.log("Login sucesso:", loginData);

      /**
       * 5️⃣ Confirma sessão (opcional, mas recomendado)
       */
      const meRes = await fetch("http://localhost:8000/api/user", {
        credentials: "include",
        headers: {
          Accept: "application/json",
        },
      });

      if (meRes.ok) {
        const meData = await meRes.json();
        console.log("Usuário autenticado:", meData);
      }

      /**
       * 6️⃣ Redireciona
       */
      router.push("/");
      router.refresh();
    } catch (err) {
      console.error("Erro no login:", err);
      setError(
        "Erro de conexão com o servidor. Verifique se o backend está rodando."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <section className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Entrar na conta
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Ou{" "}
            <Link
              href="/register"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              crie uma conta nova
            </Link>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            <Input
              name="email"
              type="email"
              placeholder="seu@email.com"
              required
              autoComplete="email"
              className="w-full"
            />
            <Input
              name="password"
              type="password"
              placeholder="••••••••"
              required
              autoComplete="current-password"
              className="w-full"
            />
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <p className="text-sm text-red-800 text-center">
                {error}
              </p>
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4"
          >
            {loading ? "Entrando..." : "Entrar"}
          </Button>
        </form>
      </section>
    </main>
  );
}

