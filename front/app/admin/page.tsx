"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { getTodosProdutosAdmin, padronizarTodosNomes, padronizaNome } from "@/lib/api";

const API_JAVA = "http://localhost:8081";

export default function AdminPage() {
  const [produtos, setProdutos] = useState<any[]>([]);
  const [itensPublic, setItensPublic] = useState<any[]>([]);
  const [busca, setBusca] = useState("");
  const [filtro, setFiltro] = useState("todos");
  const [selecionados, setSelecionados] = useState<Set<string>>(new Set());
  const [precoMassa, setPrecoMassa] = useState("99.90");
  const [qtdMassa, setQtdMassa] = useState("10");
  const [editando, setEditando] = useState<any>(null);
  const [carregando, setCarregando] = useState(false);

  useEffect(() => { carregar(); }, []);

  const carregar = async () => {
    const [prodSupabase, pubRes] = await Promise.all([
      getTodosProdutosAdmin().catch(()=>[]),
      fetch("/api/itens").then(r=>r.json()).catch(()=>[])
    ]);
    setProdutos(Array.isArray(prodSupabase)? prodSupabase : []);
    setItensPublic(Array.isArray(pubRes)? pubRes : []);
  };

  const filtrar = (lista: any[]) => lista.filter((i: any) => {
    const nome = (i.nome || "").toLowerCase();
    let cat = (i.categoria || i.tipo || "pal").toLowerCase().replace(/s$/, "");
    const filtroNorm = filtro.replace(/s$/, "");
    return nome.includes(busca.toLowerCase()) && (filtro==="todos" || cat.includes(filtroNorm));
  });

  const listaPublic = filtrar(itensPublic);
  const listaBanco = filtrar(produtos);

  // usa a mesma função do api.ts pra não ter divergência
  const jaExiste = (arquivo: string, nomeOriginal: string) => {
    const nomeNorm = padronizaNome(nomeOriginal).toLowerCase();
    const imgBase = arquivo.split("/").pop()?.toLowerCase() || "";
    return produtos.some((p:any)=> {
      const pNomeNorm = padronizaNome(p.nome).toLowerCase();
      const pImgBase = (p.imagem_url || "").split("/").pop()?.toLowerCase() || "";
      return pNomeNorm === nomeNorm || (pImgBase && pImgBase === imgBase);
    });
  };

  const toggleSelect = (arquivo: string) => {
    const novo = new Set(selecionados);
    if(novo.has(arquivo)) novo.delete(arquivo); else novo.add(arquivo);
    setSelecionados(novo);
  };

  const listarMassa = async () => {
    if(selecionados.size===0) return alert("Selecione 1");
    const paraListar = itensPublic.filter(i=> selecionados.has(i.arquivo));
    let inseridos = 0;
    let pulados = 0;

    for(const item of paraListar){
      if (jaExiste(item.arquivo, item.nome)) {
        pulados++;
        continue;
      }
      const nomeLimpo = padronizaNome(item.nome);

      const { error } = await supabase.from("produtos").insert([{
        nome: nomeLimpo,
        imagem_url: item.arquivo,
        preco: parseFloat(precoMassa),
        estoque: parseInt(qtdMassa),
        categoria: item.categoria || item.tipo || "pal",
        ativo_na_loja: true,
        ativo: true,
        tipo: item.categoria || "pal"
      }]);
      if (!error) inseridos++;
    }
    alert(`Listados: ${inseridos} | Duplicados pulados: ${pulados}`);
    setSelecionados(new Set());
    carregar();
  };

  const padronizarTudo = async () => {
    if(!confirm(`Padronizar nome de TODOS os ${produtos.length} produtos?\n\nEx:\nT_Anubis_icon_normal -> Anubis\nT_depresso_icon -> Depresso\npal_sphere_legendary -> Pal Sphere Legendary\n\nNÃO vai apagar nada, só renomear.`)) return;
    setCarregando(true);
    const qtd = await padronizarTodosNomes();
    alert(`Padronizados ${qtd} produtos! Todos agora com nome bonito.`);
    setCarregando(false);
    carregar();
  };

  const removerProduto = async (id: any) => {
    if(!id) return alert("Esse item não tem ID no banco ainda");
    if(!confirm("Remover da loja?")) return;
    await supabase.from("produtos").delete().eq("id", id);
    carregar();
  };

  const salvarEdicao = async () => {
    if(!editando?.id) return;
    await supabase.from("produtos").update({
      nome: padronizaNome(editando.nome),
      preco: parseFloat(editando.preco),
      estoque: parseInt(editando.estoque),
    }).eq("id", editando.id);
    setEditando(null);
    carregar();
  };

  const novosPublic = listaPublic.filter(i=>!jaExiste(i.arquivo, i.nome));

  return (
    <div className="min-h-screen bg-[#0B1325] p-6 text-white">
      <div className="flex flex-wrap justify-between items-center gap-2">
        <h1 className="font-bold text-[#E2C9A1]">ADMIN - Banco: {produtos.length} | Public: {itensPublic.length} | Novos: {novosPublic.length}</h1>
        <button onClick={padronizarTudo} disabled={carregando} className="bg-[#E2C9A1] hover:bg-[#d1b68f] text-black px-4 py-2 rounded-lg font-bold text-xs disabled:opacity-50">
          {carregando? "PADRONIZANDO..." : `PADRONIZAR TODOS (${produtos.length})`}
        </button>
      </div>

      <input value={busca} onChange={e=>setBusca(e.target.value)} placeholder="Buscar Anubis, Sphere..." className="w-full p-3 mt-4 bg-[#162342] rounded-xl border border-white/10 outline-none" />
      <div className="flex gap-2 mt-3 flex-wrap">
        {['todos','pal','arma','armadura','escudo','municao','esfera'].map(c=>(
          <button key={c} onClick={()=>setFiltro(c)} className={`px-3 py-1 rounded-full text-xs border ${filtro===c?'bg-[#E2C9A1] text-black':'bg-[#162342] border-white/10'}`}>{c.toUpperCase()}</button>
        ))}
      </div>

      {selecionados.size>0 && (
        <div className="mt-4 p-4 bg-[#E2C9A1] rounded-xl flex gap-3 items-center text-black">
          <span className="font-bold text-sm">{selecionados.size} selecionados</span>
          <input value={precoMassa} onChange={e=>setPrecoMassa(e.target.value)} className="w-24 p-2 rounded bg-white text-black text-sm" placeholder="Preço" />
          <input value={qtdMassa} onChange={e=>setQtdMassa(e.target.value)} className="w-20 p-2 rounded bg-white text-black text-sm" placeholder="Qtd" />
          <button onClick={listarMassa} className="bg-black text-[#E2C9A1] px-4 py-2 rounded font-bold text-sm">LISTAR TODOS LIMPO</button>
        </div>
      )}

      <h2 className="mt-8 font-bold text-[#E2C9A1]">BANCO - {listaBanco.length} itens padronizados</h2>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-3">
        {listaBanco.map((it:any, idx:number)=>(
          <div key={`banco-${idx}-${it.id || it.nome}`} className="bg-[#162342] p-3 rounded-xl border border-[#E2C9A1]/30">
            <img src={it.imagem_url || it.imagemUrl || it.imagem || it.arquivo} className="h-24 w-full object-contain" alt="" />
            <p className="text-xs font-bold truncate mt-1">{it.nome}</p>
            <p className="text-[11px] text-[#E2C9A1]">R$ {Number(it.preco).toFixed(2)} | Est: {it.estoque}</p>
            <div className="flex gap-2 mt-2">
              <button onClick={()=>setEditando({...it, preco: String(it.preco||''), estoque: String(it.estoque||'')})} className="flex-1 bg-white/10 py-1 rounded text-[10px]">EDITAR</button>
              <button onClick={()=>removerProduto(it.id)} className="flex-1 bg-red-500/20 text-red-400 py-1 rounded text-[10px]">REMOVER</button>
            </div>
          </div>
        ))}
      </div>

      <h2 className="mt-10 font-bold text-zinc-400">PUBLIC - {novosPublic.length} novos</h2>
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mt-3">
        {listaPublic.map((it:any, idx:number)=>{
          const existe = jaExiste(it.arquivo, it.nome);
          return (
            <div key={`pub-${idx}-${it.arquivo}`} className={`bg-[#162342] p-2 rounded-xl border ${selecionados.has(it.arquivo)?'border-[#E2C9A1]':'border-white/10'} ${existe?'opacity-50':''}`}>
              {!existe? <input type="checkbox" checked={selecionados.has(it.arquivo)} onChange={()=>toggleSelect(it.arquivo)} className="mb-1" /> : <span className="text-[9px] text-green-400">✅ NA LOJA</span>}
              <img src={it.arquivo} className="h-20 w-full object-contain" alt="" />
              <p className="text-[10px] truncate" title={it.nome}>{it.nome}</p>
              <p className="text-[9px] text-[#E2C9A1] truncate">→ {padronizaNome(it.nome)}</p>
            </div>
          )
        })}
      </div>

      {editando && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-[#162342] p-6 rounded-2xl w-full max-w-sm border border-[#E2C9A1]">
            <h3 className="font-bold text-[#E2C9A1]">Editar {editando.nome}</h3>
            <input value={editando.nome} onChange={e=>setEditando({...editando, nome: e.target.value})} className="w-full mt-3 p-3 rounded bg-[#0B1325] border border-white/10 text-sm" placeholder="Nome" />
            <p className="text-[10px] text-[#E2C9A1] mt-1">Vai salvar como: {padronizaNome(editando.nome)}</p>
            <input value={editando.preco} onChange={e=>setEditando({...editando, preco: e.target.value})} className="w-full mt-2 p-3 rounded bg-[#0B1325] border border-white/10 text-sm" placeholder="Preço" />
            <input value={editando.estoque} onChange={e=>setEditando({...editando, estoque: e.target.value})} className="w-full mt-2 p-3 rounded bg-[#0B1325] border border-white/10 text-sm" placeholder="Estoque" />
            <div className="flex gap-2 mt-4">
              <button onClick={()=>setEditando(null)} className="flex-1 bg-white/10 py-2 rounded text-sm">Cancelar</button>
              <button onClick={salvarEdicao} className="flex-1 bg-[#E2C9A1] text-black py-2 rounded font-bold text-sm">Salvar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}