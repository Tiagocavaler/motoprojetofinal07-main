"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

const EMAILS_AUTORIZADOS = ["admin@palworld.com"];

export default function EscolherPage() {
  const [produtos, setProdutos] = useState<any[]>([]);
  const [itensPublic, setItensPublic] = useState<any[]>([]);
  const [busca, setBusca] = useState("");
  const [filtro, setFiltro] = useState("todos");
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const clienteSalvo = localStorage.getItem("cliente");
    if (!clienteSalvo) { router.push("/login"); return; }
    try {
      const cliente = JSON.parse(clienteSalvo);
      const emailLower = cliente.email?.toLowerCase().trim() || "";
      const roleUpper = cliente.role?.toUpperCase() || "";
      const autorizado = EMAILS_AUTORIZADOS.includes(emailLower) || roleUpper === "ADMIN";
      if (!autorizado) { router.push("/"); return; }
      setIsAdmin(true);
    } catch { router.push("/login"); }
    setLoading(false);
  }, []);

  const carregar = async () => {
    const { data } = await supabase.from("produtos").select("*").order("nome");
    if (data) setProdutos(data);
  };
  const carregarPublic = async () => {
    try {
      const res = await fetch("/api/itens");
      const data = await res.json();
      setItensPublic(data || []);
    } catch { setItensPublic([]); }
  };
  useEffect(() => { if(isAdmin){ carregar(); carregarPublic(); }}, [isAdmin]);

  const cadastrarPublic = async (item: any, preco: string, qtd: string) => {
    const { error } = await supabase.from("produtos").insert({
      nome: item.nome, imagem: item.arquivo, preco: parseFloat(preco),
      estoque: parseInt(qtd), ativo_na_loja: true, categoria: item.categoria
    });
    if (error) alert(error.message); else { carregar(); }
  };
  const removerProduto = async (id: string) => {
    if(!confirm("Remover da loja?")) return;
    await supabase.from("produtos").delete().eq("id", id); carregar();
  };
  const toggleAtivo = async (p: any) => {
    await supabase.from("produtos").update({ ativo_na_loja:!p.ativo_na_loja }).eq("id", p.id); carregar();
  };

  // [CORRIGIDO] AGORA O FILTRO VALE PARA AS DUAS LISTAS
  const filtrarPorCatEBusca = (lista: any[]) => {
    return lista.filter((i: any) => {
      const matchBusca = i.nome.toLowerCase().includes(busca.toLowerCase());
      const matchCat = filtro === "todos" || i.categoria?.toLowerCase() === filtro.toLowerCase();
      return matchBusca && matchCat;
    });
  };

  const filtradosPals = filtrarPorCatEBusca(produtos);
  const filtradosPublic = filtrarPorCatEBusca(itensPublic);
  const jaExiste = (arquivo: string) => produtos.some(p => p.imagem === arquivo);

  // Contador por categoria pra ficar facil pro admin
  const contar = (cat: string) => produtos.filter(p => p.categoria?.toLowerCase() === cat).length;

  if(loading) return <div className="min-h-screen bg-[#0B1325] flex items-center justify-center text-white">Verificando...</div>;
  if(!isAdmin) return null;

  return (
    <div className="min-h-screen bg-[#0B1325] p-6 text-white">
      <div className="flex justify-between items-center flex-wrap gap-3">
        <h1 className="text-2xl font-bold text-[#E2C9A1]">Admin - Escolha o Pal e Liste</h1>
        <div className="flex gap-2">
          <Link href="/home" className="bg-[#162342] px-4 py-2 rounded-full text-sm font-bold">← Home</Link>
          <Link href="/catalogo" className="bg-[#E2C9A1] text-black px-4 py-2 rounded-full text-sm font-bold">Ver Catálogo →</Link>
        </div>
      </div>

      <input value={busca} onChange={e=>setBusca(e.target.value)} placeholder="Buscar por nome..." className="w-full bg-[#162342] p-4 rounded-xl mt-6 border border-white/10 outline-none" />

      <div className="flex gap-2 mt-4 flex-wrap">
        {[
          {id:'todos', label:`TODOS (${produtos.length})`},
          {id:'pal', label:`PAL (${contar('pal')})`},
          {id:'arma', label:`ARMA (${contar('arma')})`},
          {id:'armadura', label:`ARMADURA (${contar('armadura')})`},
          {id:'escudo', label:`ESCUDO (${contar('escudo')})`},
          {id:'municao', label:`MUNICAO (${contar('municao')})`},
          {id:'esfera', label:`ESFERA (${contar('esfera')})`},
        ].map(c => (
          <button key={c.id} onClick={()=>setFiltro(c.id)} className={`px-4 py-2 rounded-full text-xs font-bold ${filtro===c.id? 'bg-[#E2C9A1] text-black' : 'bg-[#162342] border border-white/10'}`}>
            {c.label}
          </button>
        ))}
      </div>

      <h2 className="mt-8 font-bold text-[#E2C9A1]">Pals do Banco - Já na Loja ({filtradosPals.length}) - Rota: /{filtro}</h2>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-3">
        {filtradosPals.map((p) => (
          <div key={p.id} className="bg-[#162342] p-3 rounded-xl border border-[#E2C9A1]/30">
            <img src={p.imagem} className="w-full h-20 object-contain" alt={p.nome} />
            <p className="text-xs mt-2 font-bold truncate">{p.nome}</p>
            <p className="text-[11px] text-[#E2C9A1]">R$ {p.preco} • Qtd: {p.estoque}</p>
            <p className="text-[10px] text-zinc-400">{p.categoria} {p.ativo_na_loja? "🟢" : "🔴"}</p>
            <div className="flex gap-1 mt-2">
              <button onClick={()=>toggleAtivo(p)} className={`flex-1 py-1 rounded text-[10px] font-bold ${p.ativo_na_loja? "bg-yellow-500/20 text-yellow-200" : "bg-green-500/20 text-green-200"}`}>{p.ativo_na_loja? "Desativar" : "Ativar"}</button>
              <button onClick={()=>removerProduto(p.id)} className="flex-1 bg-red-500/20 text-red-200 py-1 rounded text-[10px] font-bold">Remover</button>
            </div>
          </div>
        ))}
      </div>

      <h2 className="mt-12 font-bold text-[#E2C9A1]">Itens da Public/ Para Liberar ({filtradosPublic.length}) - Rota: /{filtro}</h2>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-3">
        {filtradosPublic.map((item: any) => (
          <div key={item.arquivo} className="bg-[#162342] p-3 rounded-xl border border-white/10">
            <img src={item.arquivo} className="w-full h-20 object-contain" alt={item.nome} />
            <p className="text-xs mt-2 truncate font-bold">{item.nome}</p>
            <p className="text-[10px] text-zinc-400">{item.categoria}</p>
            {jaExiste(item.arquivo)? <span className="block mt-2 text-[10px] text-green-400 font-black text-center bg-green-500/10 py-2 rounded">✅ NA LOJA</span> :
            <button onClick={()=>{ const preco=prompt("Preço?","99.90"); if(!preco) return; const qtd=prompt("Qtd?","10"); if(qtd) cadastrarPublic(item, preco, qtd)}} className="w-full mt-2 bg-[#E2C9A1] text-black py-2 rounded text-xs font-bold">Liberar p/ Loja</button>}
          </div>
        ))}
      </div>
    </div>
  );
}