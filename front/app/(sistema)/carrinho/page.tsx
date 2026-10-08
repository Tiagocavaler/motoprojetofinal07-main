"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

export default function PedidoPage() {
  const [carrinho, setCarrinho] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [finalizando, setFinalizando] = useState(false);

  const carregar = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("carrinho")
      .select("*, produtos(*)")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      setCarrinho([]);
      setLoading(false);
      return;
    }
    const validos = (data || []).filter((i: any) => i.produtos !== null);
    setCarrinho(validos);
    setLoading(false);
  };

  useEffect(() => { carregar(); }, []);

  // 1. NOVO: Aumenta e DIMINUI estoque real no produtos
  const aumentar = async (item: any) => {
    const estoqueAtual = item.produtos?.estoque ?? 0;
    if (estoqueAtual <= 0) {
      return alert(`Sem estoque! ${item.produtos.nome} acabou`);
    }

    await supabase.from("carrinho").update({ quantidade: item.quantidade + 1 }).eq("id", item.id);
    await supabase.from("produtos").update({ estoque: estoqueAtual - 1 }).eq("id", item.produto_id);
    carregar();
  };

  const diminuir = async (item: any) => {
    if (item.quantidade <= 1) {
      return remover(item);
    }
    await supabase.from("carrinho").update({ quantidade: item.quantidade - 1 }).eq("id", item.id);
    // 2. NOVO: Devolve 1 pro estoque
    await supabase.from("produtos").update({ estoque: (item.produtos?.estoque ?? 0) + 1 }).eq("id", item.produto_id);
    carregar();
  };

  const remover = async (item: any) => {
    if (!confirm(`Remover ${item.produtos?.nome}?`)) return;

    // 3. NOVO: Devolve tudo que estava no carrinho pro estoque
    const devolucao = item.quantidade;
    const estoqueAtual = item.produtos?.estoque ?? 0;
    
    await supabase.from("produtos").update({ estoque: estoqueAtual + devolucao }).eq("id", item.produto_id);
    await supabase.from("carrinho").delete().eq("id", item.id);
    carregar();
  };

  // 4. NOVO: Finaliza pedido - NÃO devolve estoque, cria pedido e limpa carrinho
  const finalizarPedido = async () => {
    if (finalizando) return;
    setFinalizando(true);
    try {
      const cliente_id = localStorage.getItem("cliente_id");
      const totalFinal = carrinho.reduce((acc, i) => acc + ((i.produtos?.preco || 0) * i.quantidade), 0);

      // Cria o pedido
      const { data: pedido, error } = await supabase.from("pedidos").insert([{
        cliente_id: cliente_id || null,
        total: totalFinal,
        status: "pago"
      }]).select().single();

      if (error) throw error;

      // Cria itens do pedido (se você tem tabela pedidos_itens)
      if (pedido) {
        const itens = carrinho.map((i: any) => ({
          pedido_id: pedido.id,
          produto_id: i.produto_id,
          quantidade: i.quantidade,
          preco: i.produtos.preco
        }));
        await supabase.from("pedidos_itens").insert(itens);
      }

      // Limpa carrinho sem devolver estoque (venda feita)
      await supabase.from("carrinho").delete().neq("id", "00000000-0000-0000-0000-000000000000");
      
      alert("Pedido finalizado! Estoque já baixado");
      setCarrinho([]);
    } catch (e: any) {
      alert("Erro ao finalizar: " + e.message);
    } finally {
      setFinalizando(false);
    }
  };

  const total = carrinho.reduce((acc, i) => acc + ((i.produtos?.preco || 0) * i.quantidade), 0);

  if (loading) return <div className="min-h-screen bg-[#0B1325] text-white flex items-center justify-center">Carregando...</div>;

  return (
    <div className="min-h-screen bg-[#0B1325] p-6 text-white">
      <h1 className="text-2xl font-black text-[#E2C9A1]">Pedido - Total: R$ {total.toFixed(2)}</h1>
      
      {carrinho.length === 0 ? (
        <div className="mt-8 text-center">
          <p className="text-white/60">Carrinho vazio</p>
          <Link href="/catalogo" className="mt-4 inline-block bg-[#E2C9A1] text-black px-6 py-3 rounded-xl font-bold">Ver Catálogo</Link>
        </div>
      ) : (
        <div className="mt-6 grid gap-3 max-w-2xl">
          {carrinho.map((item: any, idx: number) => {
            const semEstoqueParaAumentar = (item.produtos?.estoque ?? 0) <= 0;
            return (
              <div key={idx} className="bg-[#162342] p-4 rounded-xl flex justify-between items-center">
                <div className="flex-1">
                  <p className="font-bold text-[#E2C9A1]">{item.produtos?.nome}</p>
                  <p className="text-xs text-zinc-400">R$ {item.produtos?.preco} | Estoque restante: {item.produtos?.estoque}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => diminuir(item)} className="w-8 h-8 bg-white/10 rounded-lg font-bold">-</button>
                  <span className="w-8 text-center font-bold">{item.quantidade}</span>
                  <button 
                    disabled={semEstoqueParaAumentar} 
                    onClick={() => aumentar(item)} 
                    className={`w-8 h-8 rounded-lg font-bold ${semEstoqueParaAumentar ? 'bg-white/5 text-white/20 cursor-not-allowed' : 'bg-[#E2C9A1] text-black'}`}
                  >
                    +
                  </button>
                  <button onClick={() => remover(item)} className="ml-2 text-red-400 text-xs">X</button>
                </div>
              </div>
            )
          })}
          <button 
            onClick={finalizarPedido}
            disabled={finalizando}
            className="w-full mt-6 bg-[#E2C9A1] text-black py-4 rounded-xl font-black text-center disabled:opacity-50"
          >
            {finalizando ? "Finalizando..." : `FINALIZAR PEDIDO - R$ ${total.toFixed(2)}`}
          </button>
          <Link href="/catalogo" className="w-full bg-white/10 py-3 rounded-xl font-bold text-center block">Continuar comprando</Link>
        </div>
      )}
    </div>
  );
}