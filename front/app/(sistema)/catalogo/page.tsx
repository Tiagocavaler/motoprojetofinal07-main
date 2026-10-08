"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { getProdutos, getCarrinho, addCarrinho } from "@/lib/api";

type Produto = { 
  id: number | string; 
  nome: string; 
  imagem?: string; 
  imagem_url?: string; 
  preco: number; 
  estoque: number; 
  categoria?: string;
  tipo?: string;
};

export default function CatalogoPage() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [carrinho, setCarrinho] = useState<any[]>([]);
  const [busca, setBusca] = useState("");
  const [filtroCat, setFiltroCat] = useState("todos");
  const [loading, setLoading] = useState(true);
  const [visiveis, setVisiveis] = useState(60);
  const [adicionando, setAdicionando] = useState<string | number | null>(null);

  useEffect(() => {
    async function carregarDoSupabase() {
      try {
        setLoading(true);
        // 1. CORRIGIDO: Carrega separado pra não travar tudo se carrinho falhar
        const produtosDoBanco = await getProdutos();
        setProdutos(produtosDoBanco as any);

        try {
          const carrinhoDoBanco = await getCarrinho();
          setCarrinho(carrinhoDoBanco);
        } catch (e) {
          console.warn("Carrinho vazio", e);
          setCarrinho([]);
        }
      } catch (erro: any) {
        console.error("Erro REAL:", erro.message, erro);
        alert("Erro ao carregar catálogo: " + erro.message);
      } finally {
        setLoading(false);
      }
    }
    carregarDoSupabase();
  }, []);

  const adicionarAoCarrinho = async (produto: Produto) => {
    if (adicionando) return;
    if ((produto.estoque ?? 0) <= 0) return alert(`Indisponível! ${produto.nome} sem estoque`);

    try {
      setAdicionando(produto.id);

      // 2. CORRIGIDO: addCarrinho já baixa o estoque no banco, não precisa fazer update aqui
      await addCarrinho(produto.id);

      // 3. Atualiza na tela na hora
      setProdutos(prev => prev.map(p => 
        String(p.id) === String(produto.id) 
          ? {...p, estoque: Number(p.estoque) - 1} 
          : p
      ));

      const novoCarrinho = await getCarrinho();
      setCarrinho(novoCarrinho);

    } catch (e: any) {
      console.error("ERRO COMPLETO:", e);
      alert(e.message || "Erro ao adicionar");
      // Se deu erro de estoque, atualiza pra 0
      if (e.message?.includes("Sem estoque")) {
        setProdutos(prev => prev.map(p => String(p.id) === String(produto.id) ? {...p, estoque: 0} : p));
      }
    } finally {
      setAdicionando(null);
    }
  };

  const totalItens = carrinho.reduce((acc, i) => acc + i.quantidade, 0);
  const normaliza = (s: string) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/s$/, "");

  const filtrados = produtos.filter(p => {
    const matchBusca = p.nome.toLowerCase().includes(busca.toLowerCase());
    const catBanco = normaliza((p as any).categoria || (p as any).tipo || "pal");
    const catFiltro = normaliza(filtroCat);
    const matchCat = filtroCat === 'todos' || catBanco.includes(catFiltro) || catFiltro.includes(catBanco);
    return matchBusca && matchCat;
  });

  const paraMostrar = filtrados.slice(0, visiveis);

  if (loading) return <div className="min-h-screen bg-[#0B1325] flex items-center justify-center text-white">Carregando...</div>

  return (
    <div className="min-h-screen bg-[#0B1325] p-4 md:p-8 text-white">
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
        <h1 className="text-3xl font-bold text-[#E2C9A1]">Catálogo - {filtrados.length} / {produtos.length}</h1>
        <div className="flex gap-2">
          <input value={busca} onChange={e=>setBusca(e.target.value)} placeholder="Buscar..." className="bg-[#162342] p-3 rounded-lg border border-white/10 outline-none w-full md:w-64" />
          <Link href="/pedido" className="bg-[#E2C9A1] text-[#0B1325] px-6 py-3 rounded-lg font-bold">Carrinho ({totalItens})</Link>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        {[
          { id: 'todos', label: 'TODOS' },
          { id: 'pal', label: 'PALS' },
          { id: 'arma', label: 'ARMAS' },
          { id: 'armadura', label: 'ARMADURAS' },
          { id: 'escudo', label: 'ESCUDOS' },
          { id: 'municao', label: 'MUNIÇÃO' },
          { id: 'esfera', label: 'SPHERES' },
        ].map(cat => (
          <button key={cat.id} onClick={()=>{setFiltroCat(cat.id); setVisiveis(60);}}
            className={`px-4 py-2 rounded-full text-xs font-bold border ${filtroCat===cat.id? 'bg-[#E2C9A1] text-black border-[#E2C9A1]' : 'bg-[#162342] border-white/10 text-zinc-300'}`}>
            {cat.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {paraMostrar.map((p, index) => {
          const indisponivel = (p.estoque ?? 0) <= 0;
          const imagemSrc = (p as any).imagem_url || (p as any).imagem || "/placeholder.png";
          return (
            <div key={`${p.id}-${index}`} className="relative bg-[#162342] p-4 rounded-xl border border-white/10 hover:border-[#E2C9A1]/50 transition">
              {indisponivel && <div className="absolute inset-0 bg-black/80 z-10 flex items-center justify-center rounded-xl"><span className="bg-red-600 px-4 py-1 rounded-full font-bold text-sm">INDISPONÍVEL</span></div>}
              <img src={imagemSrc} alt={p.nome} className={`w-full h-32 object-contain ${indisponivel?'grayscale':''}`} loading="lazy" />
              <h3 className="text-[#E2C9A1] mt-2 truncate text-sm font-bold" title={p.nome}>{p.nome.replace(/_/g," ")}</h3>
              <p className="font-bold">R$ {Number(p.preco).toFixed(2)}</p>
              <p className={`text-[10px] ${indisponivel ? 'text-red-400 font-bold' : 'text-zinc-500'}`}>Estoque: {p.estoque}</p>
              <button disabled={indisponivel || adicionando===p.id} onClick={()=>adicionarAoCarrinho(p)} className={`w-full mt-3 py-2 rounded-lg font-bold text-sm ${indisponivel? 'bg-gray-600 cursor-not-allowed' : 'bg-[#E2C9A1] text-[#0B1325] hover:bg-white'}`}>
                {adicionando===p.id?'...':indisponivel?'Indisponível':'Adicionar'}
              </button>
            </div>
          )
        })}
      </div>

      {visiveis < filtrados.length && (
        <button onClick={()=>setVisiveis(v=>v+60)} className="mx-auto mt-8 block bg-white/10 px-6 py-3 rounded-xl">Carregar mais ({filtrados.length - visiveis})</button>
      )}
    </div>
  )
}