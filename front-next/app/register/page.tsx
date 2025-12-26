"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import Input from "@/app/components/ui/Input/input";
import Button from "@/app/components/ui/button/Button";
import { apiFetch } from "@/lib/api";
import { useAuth } from "app/context/AuthContext";

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);

      const name = String(formData.get("name") || "").trim();
      const email = String(formData.get("email") || "").trim();
      const password = String(formData.get("password") || "");
      const password_confirmation = String(
        formData.get("password_confirmation") || ""
      );

      if (!name || !email || !password || !password_confirmation) {
        throw new Error("Preencha todos os campos");
      }

      if (password !== password_confirmation) {
        throw new Error("As senhas não coincidem");
      }

      const res = await apiFetch("/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
          password_confirmation,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.message ||
            data.errors?.email?.[0] ||
            data.errors?.password?.[0] ||
            "Erro ao registrar"
        );
      }

      // 🔐 login via Bearer Token
      login(data.token, data.user);

      router.push("/dashboard");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Erro ao registrar");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <section className="w-full max-w-md space-y-8">
        <h1 className="text-3xl font-bold text-center">Criar conta</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input name="name" placeholder="Nome" required />
          <Input name="email" type="email" placeholder="Email" required />
          <Input name="password" type="password" placeholder="Senha" required />
          <Input
            name="password_confirmation"
            type="password"
            placeholder="Confirmar senha"
            required
          />

          {error && <p className="text-red-600 text-sm text-center">{error}</p>}

          <Button disabled={loading} type="submit" className="w-full">
            {loading ? "Criando..." : "Criar conta"}
          </Button>
        </form>

        <p className="text-center text-sm">
          Já tem conta? <Link href="/login">Entrar</Link>
        </p>
      </section>
    </main>
  );
}

