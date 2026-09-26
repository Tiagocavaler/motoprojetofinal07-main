"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getTodosProdutosAdmin } from "../../lib/api";
import { supabase } from "../../lib/supabaseClient";

const EMAIL_ADMIN = "admin@palworld.com";

export default function AdminPage() {
  const router = useRouter();
  const [produtos, setProdutos] = useState<any[]>([]);
  const [itensPublic, setItensPublic] = useState<any[]>([]);
  const [busca, setBusca] = useState("");
  const [filtro, setFiltro] = useState("todos");
  const [modalItem, setModalItem] = useState<any>(null);
  const [preco, setPreco] = useState("99.90");
  const [qtd, setQtd] = useState("10");
  const [modoEdicao, setModoEdicao] = useState(false);
  const [loadingAuth, setLoadingAuth] = useState(true);

  useEffect(() => {
    const verificarAdmin = async () => {
      // 1. TENTA PEGAR DO JAVA (seu login principal)
      const clienteRaw = localStorage.getItem("cliente");
      const cliente = clienteRaw? JSON.parse(clienteRaw) : null;

      // 2. TENTA PEGAR DO SUPABASE
      const { data: { user } } = await supabase.auth.getUser();

      console.log("Cliente Java:", cliente);
      console.log("User Supabase:", user);

      const isAdmin =
        cliente?.role === "ADMIN" ||
        cliente?.role === "ROLE_ADMIN" ||
        cliente?.email === EMAIL_ADMIN ||
        user?.email === EMAIL_ADMIN;

      if (!isAdmin) {
        alert("Acesso negado! Faça login com admin@palworld.com / admin123");
        router.push("/"); // manda pra página inicial onde tem o modal de login
        return;
      }
      setLoadingAuth(false);
      carregar();
    };
    verificarAdmin();
  }, []);

  const carregar = async () => {
    const p = await getTodosProdutosAdmin();
    setProdutos(p as any);
    const res = await fetch("/api/itens");
    const data = await res.json();
    setItensPublic(Array.isArray(data)? data : []);
  };

  const confirmar = async () => {
    if(!modalItem) return;
    if(modoEdicao){
      await supabase.from("produtos").update({ preco: parseFloat(preco), estoque: parseInt(qtd) }).eq("id", modalItem.id);
    } else {
      await supabase.from("produtos").insert({ nome: modalItem.nome, imagem: modalItem.arquivo, preco: parseFloat(preco), estoque: parseInt(qtd), ativo_na_loja: true, categoria: modalItem.categoria });
    }
    setModalItem(null);
    carregar();
  };

  const filtrar = (lista:any[]) => lista.filter((i:any)=>{
    const nome = (i.nome||"").toLowerCase();
    const cat = (i.categoria||"pal").toLowerCase();
    return nome.includes(busca.toLowerCase()) && (filtro==="todos" || cat===filtro);
  });

  if (loadingAuth) {
    return <div className="min-h-screen bg-[#0B1325] flex items-center justify-center text-white">Verificando permissão de ADM...</div>;
  }

  const listaPublic = filtrar(itensPublic.map((x:any)=> ({...x, id: x.arquivo}) ));
  const listaBanco = filtrar(produtos);
  const jaExiste = (arq:string) => produtos.some((p:any)=> p.imagem===arq);

  return (
    <div className="min-h-screen bg-[#0B1325] p-6 text-white">
      <div className="flex justify-between items-center">
        <p className="font-bold">Banco: {produtos.length} | Public: {itensPublic.length}</p>
        <button onClick={async ()=>{ localStorage.clear(); await supabase.auth.signOut(); router.push("/"); }} className="bg-white/10 px-4 py-1 rounded-full text-xs">Sair</button>
      </div>

      <input value={busca} onChange={e=>setBusca(e.target.value)} placeholder="Buscar..." className="w-full p-3 mt-4 bg-[#162342] rounded-xl border border-white/10 outline-none" />
      <div className="flex gap-2 mt-4 flex-wrap">
        {['todos','pal','arma','armadura','escudo','municao','esfera'].map(c=>(
          <button key={c} onClick={()=>setFiltro(c)} className={`px-3 py-1 rounded-full text-xs border ${filtro===c?'bg-[#E2C9A1] text-black':'bg-[#162342] border-white/10'}`}>{c.toUpperCase()}</button>
        ))}
      </div>

      <h2 className="mt-8 font-bold text-[#E2C9A1]">BANCO - {listaBanco.length} itens</h2>
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mt-3">
        {listaBanco.map((it:any)=>(
          <div key={it.id} className="bg-[#162342] p-2 rounded-xl border border-white/10">
            <img src={it.imagem} className="h-20 w-full object-contain" />
            <p className="text-[10px] truncate">{it.nome}</p>
            <p className="text-[9px] text-zinc-400">R$ {it.preco} | Qtd {it.estoque}</p>
            {/* BOTÃO CORRIGIDO - IGUAL AO DA PRINT */}
            <button onClick={()=>{ setModalItem(it); setPreco(String(it.preco)); setQtd(String(it.estoque)); setModoEdicao(true); }} className="w-full mt-1 bg-[#E2C9A1] text-black py-1.5 rounded-md text-[10px] font-bold hover:bg-white transition">Editar Valor/Qtd</button>
          </div>
        ))}
      </div>

      <h2 className="mt-8 font-bold text-zinc-400">PUBLIC - {listaPublic.length} novos pra liberar</h2>
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mt-3">
        {listaPublic.map((it:any)=>(
          <div key={it.arquivo} className="bg-[#162342] p-2 rounded-xl border border-white/10">
            <img src={it.arquivo} className="h-20 w-full object-contain" />
            <p className="text-[10px] truncate">{it.nome}</p>
            {jaExiste(it.arquivo)? <span className="text-[10px] text-green-400">✅ NA LOJA</span> : <button onClick={()=>{ setModalItem(it); setPreco("99.90"); setQtd("10"); setModoEdicao(false); }} className="w-full mt-1 bg-[#E2C9A1] text-black py-1.5 rounded-md text-[10px] font-bold hover:bg-white transition">Listar com Valor/Qtd</button>}
          </div>
        ))}
      </div>

      {modalItem && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#162342] p-6 rounded-2xl w-full max-w-sm border border-white/10">
            <h2 className="font-bold text-sm mb-3">{modalItem.nome}</h2>
            <label className="text-xs">Preço R$</label>
            <input value={preco} onChange={e=>setPreco(e.target.value)} type="number" className="w-full p-3 mt-1 mb-3 bg-[#0B1325] rounded-xl border border-white/10" />
            <label className="text-xs">Quantidade</label>
            <input value={qtd} onChange={e=>setQtd(e.target.value)} type="number" className="w-full p-3 mt-1 bg-[#0B1325] rounded-xl border border-white/10" />
            <div className="flex gap-2 mt-5">
              <button onClick={()=>setModalItem(null)} className="flex-1 py-3 rounded-xl bg-white/10">Cancelar</button>
              <button onClick={confirmar} className="flex-1 py-3 rounded-xl bg-[#E2C9A1] text-black font-bold">{modoEdicao?'Salvar':'Listar'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}