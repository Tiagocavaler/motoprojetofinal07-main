"use client";

import { useEffect, useState } from "react"; // 2. Estado + efeito
import { supabase } from "@/lib/supabaseClient" // 3. Cliente supabase - atenção pro caminho relativo, ideal usar @/lib/supabase
import { useParams } from "next/navigation"; // 4. Pega { id } da rota /produto/[id]
import Link from "next/link"; // 5. Link voltar

export default function ProdutoPage() { // 6. Página /produto/[id] - detalhe do produto
  const { id } = useParams(); // 7. id da URL - ex: /produto/123 -> id = 123
  const [produto, setProduto] = useState<any>(null); // 8. Produto que vem do banco
  const [erro, setErro] = useState(""); // 9. Mensagem de erro pra debug

  useEffect(() => { // 10. Busca ao abrir ou quando id muda
    if(!id) return; // 11. Se ainda não tem id, não busca
    const buscar = async () => {
      const { data, error } = await supabase.from("produtos").select("*").eq("id", id).single(); // 12. SELECT * FROM produtos WHERE id = id
      if(error) setErro(error.message); // 13. Erro do supabase (ex: RLS bloqueou)
      if(data) setProduto(data); // 14. Achou, guarda
      if(!data &&!error) setErro("Produto não encontrado"); // 15. Não deu erro mas veio vazio = id não existe
    };
    buscar();
  }, [id]); // 16. Dependência id

  if(erro) return <div className="p-8 bg-[#0B1325] min-h-screen text-white"><Link href="/catalogo" className="text-[#E2C9A1] text-sm">← Voltar ao catálogo</Link><p className="mt-8 text-red-400">{erro}</p><p className="text-xs text-zinc-500">ID: {id}</p></div>; // 17. Tela de erro com ID pra debug

  if(!produto) return <div className="p-8 bg-[#0B1325] min-h-screen text-white">Carregando... {id}</div>; // 18. Enquanto busca

  return ( // 19. Tela do produto encontrado
    <div className="min-h-screen bg-[#0B1325] p-8 text-white">
      <Link href="/catalogo" className="text-[#E2C9A1] text-sm">← Voltar ao catálogo</Link>

      <div className="max-w-4xl mx-auto mt-8 grid md:grid-cols-2 gap-8 bg-[#162342] p-8 rounded-2xl border border-white/10">
        <img src={produto.imagem} className="w-full h-96 object-contain bg-black/20 rounded-xl" /> {/* 20. Imagem do produto */}
        <div>
          <span className="text-xs px-3 py-1 rounded-full bg-[#E2C9A1] text-black font-bold uppercase">{produto.categoria}</span> {/* 21. Badge categoria */}
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