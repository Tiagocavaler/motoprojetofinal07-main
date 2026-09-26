"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function AtualizarSenha() {
  const [senha, setSenha] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [msg, setMsg] = useState("Carregando link...");
  const [ok, setOk] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Pega o token que veio no link do e-mail
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        setMsg("Link validado! Cadastre sua nova senha abaixo.");
      } else {
        setMsg("Link inválido ou expirado. Peça um novo e-mail.");
      }
    });
  }, []);

  async function salvar() {
    if (senha.length < 6) return setMsg("Senha precisa ter 6 caracteres");
    if (senha !== confirmar) return setMsg("As senhas não conferem");

    const { error } = await supabase.auth.updateUser({ password: senha });
    
    if (error) {
      setMsg("Erro: " + error.message);
    } else {
      setOk(true);
      setMsg("Senha cadastrada com sucesso! Redirecionando...");
      setTimeout(() => router.push("/login"), 2000);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0B1325] p-4">
      <div className="bg-[#162342] p-8 rounded-2xl w-full max-w-md border border-white/10">
        <h1 className="text-white font-bold text-xl mb-2">Cadastrar nova senha</h1>
        <p className="text-white/60 text-sm mb-6">{msg}</p>

        <input
          value={senha}
          onChange={e => setSenha(e.target.value)}
          type="password"
          placeholder="Nova senha"
          className="w-full p-3 rounded-lg bg-black/40 text-white outline-none border border-white/10 mb-3"
        />
        <input
          value={confirmar}
          onChange={e => setConfirmar(e.target.value)}
          type="password"
          placeholder="Confirmar nova senha"
          className="w-full p-3 rounded-lg bg-black/40 text-white outline-none border border-white/10 mb-4"
        />

        <button 
          onClick={salvar}
          disabled={ok}
          className="w-full bg-[#E2C9A1] py-3 rounded-lg font-bold text-black hover:bg-[#d6b98e]"
        >
          {ok ? "Salvo!" : "Salvar nova senha"}
        </button>
      </div>
    </div>
  );
}