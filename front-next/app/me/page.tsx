"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export default function MePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    async function loadUser() {
      try {
        const res = await fetch(`${API_URL}/api/user`, {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error();

        const data = await res.json();
        setUser(data);
      } catch {
        localStorage.removeItem("token");
        router.push("/login");
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, [router]);

  if (loading) {
    return <p className="p-8">Carregando...</p>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Você está logado!</h1>

      <pre className="bg-gray-100 p-4 rounded mb-4">
        {JSON.stringify(user, null, 2)}
      </pre>

      <p>Nome: {user.name}</p>
      <p>Email: {user.email}</p>
    </div>
  );
}
