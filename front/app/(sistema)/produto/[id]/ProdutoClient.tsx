"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { OFFLINE_KEYS } from "@/lib/offlineSync";

export default function ProdutoClient({ id }: { id: string }) {
  const [produto, setProduto] = useState<any>(null);

  useEffect(() => {
    if(!id) return;
    const buscar = async () => {
      const cacheStr = localStorage.getItem(OFFLINE_KEYS.PRODUTOS);
      if(cacheStr) {
        try {
          const cache = JSON.parse(cacheStr);
          const achado = cache.find((p: any) => String(p.id) === String(id));
          if(achado) setProduto(achado);
        } catch {}
      }
      try {
        const { data } = await supabase.from("produtos").select("*").eq("id", id).single();
        if(data) setProduto(data);
      } catch {}
    };
    buscar();
  }, [id]);

  if(!produto) return <div className="p-8 bg-[#0B1325] min-h-screen text-white">Carregando {id}...</div>;

  return (
    <div className="min-h-screen bg-[#0B1325] p-8 text-white">
      <Link href="/catalogo" className="text-[#E2C9A1] text-sm">← Voltar ao catálogo</Link>
      <h1 className="text-3xl mt-4 text-[#E2C9A1]">{produto.nome}</h1>
      <p>R$ {produto.preco}</p>
    </div>
  );
}