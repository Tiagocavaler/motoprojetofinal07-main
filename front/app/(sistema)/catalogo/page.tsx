"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { getProdutos, getCarrinho, addCarrinho } from "@/lib/api";

type Produto = { id: string; nome: string; imagem: string; preco: number; estoque: number; categoria?: string };

export default function CatalogoPage() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [carrinho, setCarrinho] = useState<any[]>([]);
  const [busca, setBusca] = useState("");
  const [filtroCat, setFiltroCat] = useState("todos"); // NOVO: filtro por categoria
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregarDoSupabase() {
      try {
        setLoading(true);
        const produtosDoBanco = await getProdutos(); // Já vem com armas, armaduras, munição, spheres que você cadastrou no ADMIN
        const carrinhoDoBanco = await getCarrinho();
        setProdutos(produtosDoBanco as any);
        setCarrinho(carrinhoDoBanco);
      } catch (erro) {
        console.error("Erro:", erro);
      } finally {
        setLoading(false);
      }
    }
    carregarDoSupabase();
  }, []);

  const adicionarAoCarrinho = async (produto: Produto) => {
    if (produto.estoque <= 0) return alert("Indisponível!");
    const existe = carrinho.find((i: any) => i.produto_id === produto.id);
    if (existe && existe.quantidade >= produto.estoque) return alert(`Só temos ${produto.estoque} unidades!`);
    try {
      await addCarrinho(produto.id);
      const novo = await getCarrinho();
      setCarrinho(novo);
    } catch (e) { alert("Erro ao adicionar"); }
  };

  const totalItens = carrinho.reduce((acc, i) => acc + i.quantidade, 0);

  // NOVO: Filtro com busca + categoria (arma, armadura, munição, esfera)
  const filtrados = produtos.filter(p => {
    const matchBusca = p.nome.toLowerCase().includes(busca.toLowerCase());
    const matchCat = filtroCat === 'todos' || (p as any).categoria === filtroCat || (!p.categoria && filtroCat === 'pal'); // se não tem categoria é Pal
    return matchBusca && matchCat;
  });

  if (loading) return <div className="min-h-screen bg-[#0B1325] flex items-center justify-center text-white">Carregando do Supabase...</div>

  return (
    <div className="min-h-screen bg-[#0B1325] p-4 md:p-8 text-white">
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
        <h1 className="text-3xl font-bold text-[#E2C9A1]">Catálogo - {produtos.length} itens</h1>
        <div className="flex gap-2">
          <input value={busca} onChange={e=>setBusca(e.target.value)} placeholder="Buscar Anubis, Sphere, Rifle..." className="bg-[#162342] p-3 rounded-lg border border-white/10 outline-none w-full md:w-64" />
          <Link href="/pedido" className="bg-[#E2C9A1] text-[#0B1325] px-6 py-3 rounded-lg font-bold">Carrinho ({totalItens})</Link>
        </div>
      </div>

      {/* NOVO: Filtros por categoria - vem da public/ que você adicionou */}
      <div className="flex flex-wrap gap-2 mb-8">
        {[
          { id: 'todos', label: 'TODOS' },
          { id: 'pal', label: 'PALS' },
          { id: 'arma', label: 'ARMAS' },
          { id: 'armadura', label: 'ARMADURAS' },
          { id: 'munição', label: 'MUNIÇÃO' },
          { id: 'esfera', label: 'SPHERES' },
        ].map(cat => (
          <button key={cat.id} onClick={()=>setFiltroCat(cat.id)}
            className={`px-4 py-2 rounded-full text-xs font-bold border ${filtroCat===cat.id? 'bg-[#E2C9A1] text-black border-[#E2C9A1]' : 'bg-[#162342] border-white/10 text-zinc-300'}`}>
            {cat.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {filtrados.map(p => {
          const indisponivel = p.estoque <= 0;
          return (
            <div key={p.id} className="relative bg-[#162342] p-4 rounded-xl border border-white/10 hover:border-[#E2C9A1]/50 transition">
              {indisponivel && <div className="absolute inset-0 bg-black/80 z-10 flex items-center justify-center rounded-xl"><span className="bg-red-600 px-4 py-1 rounded-full font-bold text-sm">INDISPONÍVEL</span></div>}
              {/* p.imagem agora pode ser /armas/xxx.png, /armaduras/xxx.png, /municao/xxx.png, /spheres/xxx.png que você colocou na public/ */}
              <img src={p.imagem} alt={p.nome} className={`w-full h-32 object-contain ${indisponivel?'grayscale':''}`} />
              <h3 className="text-[#E2C9A1] mt-2 truncate text-sm font-bold">{p.nome.replace(/_/g," ")}</h3>
              <p className="text-[10px] text-zinc-400 uppercase">{(p as any).categoria || 'Pal'}</p>
              <p className="font-bold">R$ {Number(p.preco).toFixed(2)}</p>
              <p className="text-[10px] text-zinc-500">Estoque: {p.estoque}</p>
              <button disabled={indisponivel} onClick={()=>adicionarAoCarrinho(p)} className={`w-full mt-3 py-2 rounded-lg font-bold text-sm ${indisponivel?'bg-gray-600':'bg-[#E2C9A1] text-[#0B1325] hover:bg-white'}`}>{indisponivel?'Indisponível':'Adicionar'}</button>
            </div>
          )
        })}
      </div>

      {filtrados.length === 0 && (
        <div className="text-center mt-10 text-zinc-400">
          <p>Nenhum item nessa categoria ainda.</p>
          <p className="text-xs mt-2">Vá em /produto e clique em CADASTRAR NA LOJA nos itens da public/</p>
        </div>
      )}
    </div>
  )
}