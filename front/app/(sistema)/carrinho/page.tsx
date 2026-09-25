"use client";


import { useState, useEffect } from "react"; // 2. Memória e carregar ao abrir
import { createClient } from "@supabase/supabase-js"; // 3. Cria cliente Supabase direto aqui (não usa lib)
import Link from "next/link"; // 4. Link leve
import { useRouter } from "next/navigation"; // 5. router.push()

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!, // 6. URL do teu projeto Supabase
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY! // 7. Anon key pública
);

export default function CarrinhoPage() { // 8. Rota /carrinho
  const [carrinho, setCarrinho] = useState<any[]>([]); // 9. Guarda linhas da tabela carrinho + produto joinado
  const [loading, setLoading] = useState(true); // 10. Loading inicial
  const router = useRouter(); // 11. Navegação

  // 12. CARREGA CARRINHO: Busca do Supabase com join na tabela produtos
  const carregar = async () => {
    setLoading(true); // 13. Liga loading
    const { data } = await supabase.from("carrinho").select("*, produtos(*)").order("created_at", { ascending: false }); // 14. SELECT com join - pega carrinho + dados do produto junto
    if (data) setCarrinho(data); // 15. Guarda no estado
    setLoading(false); // 16. Desliga loading
  };

  useEffect(() => { carregar(); }, []); // 17. Carrega 1x quando abre página

  // 18. NAVEGABILIDADE + LÓGICA: Aumentar quantidade do item
  const aumentar = async (item: any) => {
    await supabase.from("carrinho").update({ quantidade: item.quantidade + 1 }).eq("id", item.id); // 19. UPDATE quantidade +1 na linha do carrinho
    carregar(); // 20. Recarrega pra atualizar total
  };

  // 21. NAVEGABILIDADE + LÓGICA: Diminuir ou remover se chegar a 0
  const diminuir = async (item: any) => {
    if (item.quantidade <= 1) { // 22. Se qtd for 1 e clicar em menos, remove o item do carrinho
      // 23. Se qtd for 1 e clicar em menos, remove o item do carrinho
      await supabase.from("carrinho").delete().eq("id", item.id); // 24. DELETE da linha
    } else {
      await supabase.from("carrinho").update({ quantidade: item.quantidade - 1 }).eq("id", item.id); // 25. Se >1, só diminui 1
    }
    carregar(); // 26. Atualiza lista
  };

  // 27. LÓGICA: Remover item direto
  const remover = async (id: string) => {
    await supabase.from("carrinho").delete().eq("id", id); // 28. DELETE direto pelo botão Remover
    carregar();
  };

  // 29. CÁLCULO: Soma total do carrinho
  const total = carrinho.reduce((acc, i) => acc + (i.produtos.preco * i.quantidade), 0); // 30. Soma preco*qtd de cada item

  if (loading) return <div className="p-8 text-white">Carregando carrinho...</div>; // 31. Tela de loading

  // 32. NAVEGABILIDADE: Se carrinho vazio, não joga pro catálogo automático, mostra opção de ir
  if (carrinho.length === 0) { // 33. Caso carrinho vazio
    return (
      <div className="p-8 text-white text-center max-w-2xl mx-auto">
        <h1 className="text-2xl font-black text-[#E2C9A1]">Carrinho Vazio</h1>
        <p className="mt-2 text-white/60">Adicione algum Pal no catálogo</p>
        <Link href="/catalogo" className="inline-block mt-6 bg-[#E2C9A1] text-black px-8 py-3 rounded-xl font-bold">Ir para Catálogo</Link>
      </div>
    );
  }

  return (
    // 34. ESTRUTURA: Container principal já dentro do SistemaLayout (com Header)
    <div className="p-4 md:p-8 text-white">
      {/* 35. NAVEGABILIDADE: Botão voltar para o catálogo - exigência da banca */}
      <button onClick={() => router.push('/catalogo')} className="mb-6 text-white/60 hover:text-white text-sm">
        ← Voltar para o Catálogo
      </button>

      <h1 className="text-2xl font-black text-[#E2C9A1] mb-6">Carrinho de Compras</h1>

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {/* 36. LISTAGEM: Itens do carrinho - ocupa 2 colunas */}
        <div className="md:col-span-2 space-y-3">
          {carrinho.map(item => (
            <div key={item.id} className="bg-[#162342] p-4 rounded-xl border border-white/10 flex items-center gap-4">
              <img src={item.produtos.imagem} className="w-20 h-20 object-contain bg-[#0B1325] rounded-lg" />
              <div className="flex-1">
                <p className="font-bold text-[#E2C9A1]">{item.produtos.nome}</p>
                <p className="text-sm">R$ {item.produtos.preco} | Estoque: {item.produtos.estoque}</p>
                <div className="flex items-center gap-3 mt-2">
                  <button onClick={()=>diminuir(item)} className="w-8 h-8 bg-[#0B1325] rounded border border-white/10">-</button>
                  <span className="font-bold">{item.quantidade}</span>
                  <button onClick={()=>aumentar(item)} className="w-8 h-8 bg-[#0B1325] rounded border border-white/10">+</button>
                  <button onClick={()=>remover(item.id)} className="ml-4 text-red-400 text-xs">Remover</button>
                </div>
              </div>
              <p className="font-black">R$ {(item.produtos.preco * item.quantidade).toFixed(2)}</p>
            </div>
          ))}
        </div>

        {/* 37. RESUMO E NAVEGABILIDADE: Vai para o pagamento */}
        <div className="bg-[#162342] p-6 rounded-2xl border border-white/10 h-fit">
          <h2 className="font-bold mb-4">Resumo</h2>
          <div className="flex justify-between mb-2 text-sm"><span>Subtotal</span><span>R$ {total.toFixed(2)}</span></div>
          <div className="flex justify-between font-black text-[#E2C9A1] text-lg border-t border-white/10 pt-4 mt-4"><span>Total</span><span>R$ {total.toFixed(2)}</span></div>
          
          {/* 38. NAVEGABILIDADE CRÍTICA: Cliente -> Pagamento. Se sua pasta chama /pedido, troque aqui */}
          <button onClick={()=>router.push("/pedido")} className="w-full mt-6 bg-[#E2C9A1] text-black py-4 rounded-xl font-black hover:bg-[#d6b88a]">
            IR PARA PAGAMENTO
          </button>
          <Link href="/catalogo" className="block text-center mt-3 text-xs text-white/60 hover:text-white">← Continuar comprando</Link>
        </div>
      </div>
    </div>
  );
}