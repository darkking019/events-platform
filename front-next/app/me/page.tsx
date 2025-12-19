// app/me/page.tsx  (criar essa pasta e arquivo)

import { redirect } from "next/navigation";

async function getUser() {
  const res = await fetch("http://localhost:8000/api/user", {
    credentials: "include",  // essencial pra enviar o cookie de sessão
    headers: {
      Accept: "application/json",
    },
  });

  if (!res.ok) {
    return null;
  }

  return res.json();
}

export default async function MePage() {
  const user = await getUser();

  if (!user) {
    redirect("/login");  // se não logado, joga pro login
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Você está logado!</h1>
      <pre className="bg-gray-100 p-4 rounded">
        {JSON.stringify(user, null, 2)}
      </pre>
      <p>Nome: {user.name}</p>
      <p>Email: {user.email}</p>
    </div>
  );
}