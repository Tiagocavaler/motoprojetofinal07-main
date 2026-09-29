"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const entrar = async () => {
    if (!email ||!senha) return alert("Preencha e-mail e senha");
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8081/usuarios/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.toLowerCase().trim(),
          senha
        })
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "E-mail ou senha incorretos");
      }

      const data = await res.json();

      localStorage.setItem("cliente", JSON.stringify(data));
      localStorage.setItem("cliente_id", String(data.id));

      if (data.status === "INATIVO" || data.status === "ESPORADICO") {
        alert(`Bem-vindo de volta ${data.nome}! Sua conta foi reativada para ATIVO.`);
      }

      // CORRIGIDO: Cliente vai pra Home
      if (data.role === "ADMIN" || data.role === "ROLE_ADMIN") {
        router.push("/admin");
      } else {
        router.push("/home"); // troque para "/" se sua home for na raiz
      }

    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1325] flex items-center justify-center p-4 text-white">
      <div className="bg-[#162342] p-8 rounded-2xl w-full max-w-sm border border-white/10">
        <Link href="/" className="text-xs text-gray-400">← Voltar</Link>
        <h1 className="text-2xl font-black text-[#E2C9A1] mt-4">Entrar</h1>
        <p className="text-[11px] text-gray-400 mt-1">Acesse sua conta</p>

        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="E-mail" className="w-full mt-6 bg-[#0B1325] p-3 rounded-lg border border-white/10 outline-none" />
        <input value={senha} onChange={e=>setSenha(e.target.value)} type="password" placeholder="Senha" className="w-full mt-3 bg-[#0B1325] p-3 rounded-lg border border-white/10 outline-none" />

        <div className="flex justify-end mt-3">
          <Link href="/esqueci" className="text-[11px] text-[#E2C9A1] hover:underline">
            Esqueceu a senha?
          </Link>
        </div>

        <button onClick={entrar} disabled={loading} className="w-full mt-5 bg-[#E2C9A1] text-black py-3 rounded-lg font-black disabled:opacity-50">
          {loading? "ENTRANDO..." : "ENTRAR"}
        </button>

        <p className="text-center text-[11px] mt-4 text-zinc-400">Não tem conta? <Link href="/register" className="text-[#E2C9A1]">Cadastre-se</Link></p>
      </div>
    </div>
  );
}