"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { getTodosProdutosAdmin, padronizaNome } from "@/lib/api";

export default function AdminPage() {
  const [produtos, setProdutos] = useState<any[]>([]);
  const [itensPublic, setItensPublic] = useState<any[]>([]);
  const [busca, setBusca] = useState("");
  const [categoriaAtiva, setCategoriaAtiva] = useState("todos");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ nome: "", quantidade: "10", preco: "99.90", imagem: "", categoria: "palls" });
  const [upFile, setUpFile] = useState<File | null>(null);

  useEffect(()=>{ carregar(); },[]);

  const carregar = async () => {
    const { data: prods } = await supabase.from('produtos').select('*').order('nome').range(0,2000);
    setProdutos(prods || []);
    // LISTA CORRETA DO BUCKET produtos COM SUBPASTAS
    const BUCKET = "produtos";
    const pastas = ["armaduras","armas","escudo","esferas","gifs","municao","palls",""];
    let todos:any[] = [];
    for (const pasta of pastas) {
      const { data } = await supabase.storage.from(BUCKET).list(pasta, { limit: 1000 });
      if (data) {
        for (const f of data) {
          if (!/\.(png|webp|jpg|jpeg)$/i.test(f.name)) continue;
          const path = pasta ? `${pasta}/${f.name}` : f.name;
          const { data: url } = supabase.storage.from(BUCKET).getPublicUrl(path);
          todos.push({ arquivo: url.publicUrl, nome: f.name.replace(/\.[^/.]+$/, ""), categoria: pasta || "palls", path });
        }
      }
    }
    setItensPublic(todos);
  };

  const filtradosPublic = itensPublic.filter((i:any)=>{
    const okCat = categoriaAtiva==="todos" || i.categoria===categoriaAtiva;
    const okBusca = !busca || i.nome.toLowerCase().includes(busca.toLowerCase());
    return okCat && okBusca;
  });

  const selecionarDoBucket = (item:any) => {
    setForm({ ...form, nome: padronizaNome(item.nome), imagem: item.arquivo, categoria: item.categoria });
  };

  const salvarProduto = async () => {
    let imagemFinal = form.imagem;
    // se usuário selecionou arquivo pra upload
    if (upFile) {
      const nomeArq = `${form.categoria}/${Date.now()}_${upFile.name}`;
      const { error: upErr } = await supabase.storage.from("produtos").upload(nomeArq, upFile);
      if (upErr) return alert("Erro upload: "+upErr.message);
      const { data } = supabase.storage.from("produtos").getPublicUrl(nomeArq);
      imagemFinal = data.publicUrl;
    }
    if (!form.nome || !imagemFinal) return alert("Selecione imagem do bucket OU faça upload + preencha nome!");
    const { error } = await supabase.from("produtos").insert([{
      nome: padronizaNome(form.nome),
      imagem_url: imagemFinal,
      preco: parseFloat(form.preco),
      estoque: parseInt(form.quantidade),
      categoria: form.categoria,
      tipo: form.categoria,
      ativo_na_loja: true
    }]);
    if (error) return alert("Erro: "+error.message);
    alert("Produto cadastrado! Agora tem "+(produtos.length+1));
    setShowModal(false);
    setForm({ nome: "", quantidade: "10", preco: "99.90", imagem: "", categoria: "palls" });
    setUpFile(null);
    carregar();
  };

  return (
    <div className="min-h-screen bg-[#0B1325] p-6 text-white">
      <div className="flex justify-between items-center">
        <h1 className="font-bold text-[#E2C9A1]">ADMIN - Banco: {produtos.length} | Public: {itensPublic.length} | Novos: {itensPublic.length}</h1>
        <button onClick={()=>setShowModal(true)} className="bg-[#E2C9A1] text-black px-6 py-3 rounded-xl font-black">+ CADASTRAR NOVO PRODUTO</button>
      </div>

      <input value={busca} onChange={e=>setBusca(e.target.value)} placeholder="Buscar Anubis, Sphere..." className="w-full p-3 bg-[#162342] rounded-xl border border-white/10 mt-6" />
      
      <div className="flex gap-2 mt-4 flex-wrap">
        {["todos","palls","armas","armaduras","escudos","municao","esferas","pal"].map(c=>(
          <button key={c} onClick={()=>setCategoriaAtiva(c==="pal"?"palls":c==="escudos"?"escudo":c==="esferas"?"esferas":c)} className={`px-3 py-1 rounded-full text-xs ${categoriaAtiva===c || (c==="pal"&&categoriaAtiva==="palls") ? 'bg-[#E2C9A1] text-black font-bold':'bg-white/10'}`}>{c.toUpperCase()}</button>
        ))}
      </div>

      <h2 className="mt-8 font-bold">BANCO - {produtos.length} itens padronizados</h2>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-3">
        {produtos.map((it:any)=>(
          <div key={it.id} className="bg-[#162342] p-3 rounded-xl border border-white/10">
            <img src={it.imagem_url} className="h-24 w-full object-contain" />
            <p className="text-xs font-bold truncate">{padronizaNome(it.nome)}</p>
            <p className="text-[11px] text-[#E2C9A1]">R$ {Number(it.preco).toFixed(2)} | Est: {it.estoque}</p>
          </div>
        ))}
      </div>

      <h2 className="mt-8 font-bold">PUBLIC - {filtradosPublic.length} novos do bucket produtos</h2>
      <p className="text-xs text-zinc-500">Clique num PNG para cadastrar</p>
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mt-3">
        {filtradosPublic.slice(0,60).map((it:any)=>(
          <button key={it.arquivo} onClick={()=>{setShowModal(true); selecionarDoBucket(it);}} className="bg-[#162342] p-2 rounded-xl border border-white/10 hover:border-[#E2C9A1]">
            <img src={it.arquivo} className="h-20 w-full object-contain" />
            <p className="text-[9px] truncate mt-1">{padronizaNome(it.nome)}</p>
            <p className="text-[8px] text-[#E2C9A1]">{it.categoria}</p>
          </button>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-[#162342] w-full max-w-6xl max-h-[90vh] overflow-hidden rounded-2xl border border-[#E2C9A1] flex flex-col">
            <div className="p-6 border-b border-white/10 flex justify-between items-center">
              <h2 className="font-black text-[#E2C9A1]">CADASTRAR NOVO PRODUTO - Bucket produtos dividido por categoria</h2>
              <button onClick={()=>setShowModal(false)} className="bg-white/10 px-3 py-1 rounded">X</button>
            </div>
            <div className="flex flex-1 overflow-hidden">
              <div className="w-48 bg-[#0B1325] p-4 border-r border-white/10 overflow-y-auto">
                <p className="text-xs text-zinc-500 mb-3">PASTAS BUCKET produtos</p>
                {["armaduras","armas","escudo","esferas","gifs","municao","palls"].map(cat=>(
                  <button key={cat} onClick={()=>setCategoriaAtiva(cat)} className={`w-full text-left px-3 py-2 rounded-lg text-sm mb-1 ${form.categoria===cat?'bg-[#E2C9A1] text-black font-bold':'bg-white/5'}`}>📁 {cat}</button>
                ))}
                <div className="mt-4 text-[10px] text-zinc-500">PUBLIC: {itensPublic.length} PNGs encontrados</div>
              </div>
              <div className="flex-1 p-4 overflow-y-auto">
                <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                  {filtradosPublic.map((it:any)=>(
                    <button key={it.arquivo} onClick={()=>selecionarDoBucket(it)} className={`bg-[#0B1325] p-2 rounded-xl border-2 ${form.imagem===it.arquivo?'border-[#E2C9A1]':'border-white/10'}`}>
                      <img src={it.arquivo} className="h-20 w-full object-contain" />
                      <p className="text-[10px] truncate mt-1">{padronizaNome(it.nome)}</p>
                    </button>
                  ))}
                </div>
                {filtradosPublic.length===0 && <p className="text-zinc-500 text-sm">Nenhum PNG. Faz upload ao lado →</p>}
              </div>
              <div className="w-80 bg-[#0B1325] p-6 border-l border-white/10 overflow-y-auto">
                {form.imagem && <img src={form.imagem} className="w-full h-32 object-contain bg-black/20 rounded-xl mb-4" />}
                <label className="text-xs text-zinc-400">Nome (auto-preenche ao clicar na imagem do bucket)</label>
                <input value={form.nome} onChange={e=>setForm({...form, nome: e.target.value})} className="w-full mt-1 p-3 rounded-xl bg-[#162342] border border-white/10 text-sm" />
                <label className="text-xs text-zinc-400 mt-4 block">Categoria</label>
                <select value={form.categoria} onChange={e=>setForm({...form, categoria: e.target.value})} className="w-full mt-1 p-3 rounded-xl bg-[#162342] border border-white/10 text-sm">
                  <option value="palls">palls</option><option value="armaduras">armaduras</option><option value="armas">armas</option><option value="escudo">escudo</option><option value="esferas">esferas</option><option value="gifs">gifs</option><option value="municao">municao</option>
                </select>
                <label className="text-xs text-zinc-400 mt-4 block">Quantidade</label>
                <input value={form.quantidade} onChange={e=>setForm({...form, quantidade: e.target.value})} className="w-full mt-1 p-3 rounded-xl bg-[#162342] border border-white/10 text-sm" />
                <label className="text-xs text-zinc-400 mt-4 block">Preço</label>
                <input value={form.preco} onChange={e=>setForm({...form, preco: e.target.value})} className="w-full mt-1 p-3 rounded-xl bg-[#162342] border border-white/10 text-sm" />
                <div className="mt-4 border-t border-white/10 pt-4">
                  <label className="text-xs text-zinc-400">OU fazer upload novo para o bucket produtos</label>
                  <input type="file" accept="image/*" onChange={e=>setUpFile(e.target.files?.[0]||null)} className="w-full mt-2 text-xs" />
                  {upFile && <p className="text-xs text-[#E2C9A1] mt-1">{upFile.name}</p>}
                </div>
                <button onClick={salvarProduto} className="w-full mt-6 bg-[#E2C9A1] text-black py-3 rounded-xl font-black">CADASTRAR NO CATÁLOGO</button>
                <p className="text-[10px] text-zinc-500 mt-3">1. Clica numa imagem do bucket à esquerda → nome auto-preenche<br/>2. Só põe quantidade + valor<br/>3. Cadastrar</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}