"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const Page = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    const res = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
      }),
    });

    if (res.ok) {
      window.location.href = "/";
    } else {
      alert("Credenciais inválidas");
    }
  }

  return (
    <div className="bg-neutral-100 flex justify-center items-center min-h-screen">
      <form
        onSubmit={handleLogin}
        className="flex flex-col gap-4 bg-white p-6 rounded-lg shadow-md"
      >
        <Input
          placeholder="Usuário"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="border border-neutral-300 p-2 rounded-md"
        />

        <Input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border border-neutral-300 p-2 rounded-md"
        />

        <Button type="submit" className="bg-blue-500 hover:bg-blue-600">
          Entrar
        </Button>
      </form>
    </div>
  );
};

export default Page;
