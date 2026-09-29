"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function AtualizarSenha(){
  const [novaSenha, setNovaSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(()=> {
    // Pega token de?token=... ou?access_token=... ou do #hash do Supabase
    const tokenUrl = searchParams.get("token") || searchParams.get("access_token");
    if(tokenUrl){
      setToken(tokenUrl);
    } else {
      // Fallback: tenta ler do hash #access_token=... (link antigo do Supabase)
      const hash = window.location.hash;
      if(hash.includes("access_token")){
        const params = new URLSearchParams(hash.replace("#","?"));
        setToken(params.get("access_token") || "");
      }
    }
  },[searchParams]);

  const salvar = async (e:any) => {
    e.preventDefault();
    if(novaSenha.length < 6) return alert("Mínimo 6 caracteres");
    if(!token) return alert("Link inválido ou expirado. Peça outro em /esqueci");

    setLoading(true);
    try{
      const res = await fetch("/api/auth/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, novaSenha }),
      });
      const text = await res.text();
      let data: any = {};
      try { data = text? JSON.parse(text) : {}; } catch { data = { message: text } }

      if(!res.ok) throw new Error(data.error || data.message || "Link expirado");

      alert("Senha trocada! Faça login.");
      router.push("/login");
    }catch(err:any){
      alert(err.message);
    }finally{
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0B1325] p-4">
      <form onSubmit={salvar} className="bg-[#162342] p-8 rounded-2xl w-full max-w-sm space-y-4">
        <h1 className="text-white font-bold text-xl">Nova senha</h1>
        {!token && <p className="text-red-300 text-sm">Link inválido. Gere um novo em /esqueci</p>}
        <input value={novaSenha} onChange={e=>setNovaSenha(e.target.value)} type="password" placeholder="Nova senha (mín 6)" className="w-full p-3 rounded-lg bg-black/30 text-white" required />
        <button disabled={loading ||!token} className="w-full bg-[#E2C9A1] text-black py-3 rounded-lg font-bold disabled:opacity-50">{loading?"Salvando...":"Salvar nova senha"}</button>
      </form>
    </div>
  )
}