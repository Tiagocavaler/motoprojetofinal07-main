"use client";
import { useState } from "react";
import Link from "next/link";

export default function EsqueciSenha(){
  const [email,setEmail]=useState("");
  const [loading,setLoading]=useState(false);
  const [ok,setOk]=useState(false);
  const [erro,setErro]=useState("");

  const handle = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErro("");
    try{
      // chama a rota que existe no seu print: /api/auth/forgot
      const res = await fetch("/api/auth/forgot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      
      const text = await res.text();
      let data: any = {};
      try { data = text ? JSON.parse(text) : {}; } 
      catch { data = { error: text }; }

      if(!res.ok) throw new Error(data.error || data.message || "Erro ao enviar");

      setOk(true); // sucesso
    }catch(err:any){
      setErro(err.message);
    }finally{
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0B1325] p-4">
      <div className="bg-[#162342] p-8 rounded-2xl w-full max-w-md">
        <h1 className="text-white font-bold text-xl">Recuperar senha</h1>
        {erro && <p className="text-red-300 bg-red-500/20 p-3 rounded-lg mt-4 text-sm">{erro}</p>}
        {ok ? (
          <p className="text-green-300 mt-4">Se o e-mail existir, enviamos o link! Verifique seu e-mail. (10 min, uso único, máx 3 por dia)</p>
        ) : (
          <form onSubmit={handle} className="mt-4 space-y-3">
            <input value={email} onChange={(e)=>setEmail(e.target.value)} type="email" placeholder="seu@email.com" className="w-full p-3 rounded-lg bg-black/30 text-white" required />
            <button disabled={loading} className="w-full bg-[#E2C9A1] py-3 rounded-lg font-bold text-black disabled:opacity-50">{loading?"Enviando...":"Enviar link"}</button>
          </form>
        )}
        <Link href="/login" className="text-white/50 text-sm mt-4 block text-center">Voltar ao login</Link>
      </div>
    </div>
  )
}