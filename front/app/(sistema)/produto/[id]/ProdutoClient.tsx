"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function ProdutoClient() {
  const { id } = useParams();
  const [produto, setProduto] = useState<any>(null);
  const [erro, setErro] = useState("");

  useEffect(() => {
    if(!id) return;
    const buscar = async () => {
      const { data, error } = await supabase.from("produtos").select("*").eq("id", id).single();
      if(error) setErro(error.message);
      if(data) setProduto(data);
      if(!data &&!error) setErro("Produto não encontrado");
    };
    buscar();
  }, [id]);

  if(erro) return <div className="p-8 bg-[#0B1325] min-h-screen text-white"><Link href="/catalogo" className="text-[#E2C9A1] text-sm">← Voltar ao catálogo</Link><p className="mt-8 text-red-400">{erro}</p><p className="text-xs text-zinc-500">ID: {id}</p></div>;

  if(!produto) return <div className="p-8 bg-[#0B1325] min-h-screen text-white">Carregando... {String(id)}</div>;

  return (
    <div className="min-h-screen bg-[#0B1325] p-8 text-white">
      <Link href="/catalogo" className="text-[#E2C9A1] text-sm">← Voltar ao catálogo</Link>
      <div className="max-w-4xl mx-auto mt-8 grid md:grid-cols-2 gap-8 bg-[#162342] p-8 rounded-2xl border border-white/10">
        <img src={produto.imagem} className="w-full h-96 object-contain bg-black/20 rounded-xl" />
        <div>
          <span className="text-xs px-3 py-1 rounded-full bg-[#E2C9A1] text-black font-bold uppercase">{produto.categoria}</span>
          <h1 className="text-3xl font-black mt-4 text-[#E2C9A1]">{produto.nome}</h1>
          <p className="text-2xl mt-4 font-bold">R$ {produto.preco}</p>
          <p className="text-sm text-zinc-400 mt-2">Estoque: {produto.estoque}</p>
          <button className="w-full mt-8 bg-[#E2C9A1] text-black py-4 rounded-xl font-black">
            ADICIONAR AO CARRINHO
          </button>
        </div>
      </div>
    </div>
  );
}