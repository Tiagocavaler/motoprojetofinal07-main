"use client";
import { useState, useEffect } from "react";
import { getCarrinho, updateQuantidadeCarrinho, removerCarrinho, criarPedido } from "@/lib/api";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function PedidoPage() {
  const [carrinho, setCarrinho] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [finalizando, setFinalizando] = useState(false);
  const router = useRouter();

  const carregar = async () => {
    try {
      setLoading(true);
      const data = await getCarrinho();
      setCarrinho(data.filter((i: any) => i.produtos !== null));
    } catch (e: any) {
      console.error("Erro carrinho:", e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { carregar(); }, []);

  const aumentar = async (item: any) => {
    try {
      await updateQuantidadeCarrinho(item.id, item.quantidade + 1);
      carregar();
    } catch (e: any) {
      alert(e.message);
    }
  };

  const diminuir = async (item: any) => {
    try {
      await updateQuantidadeCarrinho(item.id, item.quantidade - 1);
      carregar();
    } catch (e: any) {
      alert(e.message);
    }
  };

  const total = carrinho.reduce((acc, i) => acc + ((i.produtos?.preco || 0) * i.quantidade), 0);

  const finalizar = async () => {
    if (finalizando) return;
    setFinalizando(true);
    try {
      const pedido = await criarPedido(total, carrinho);
      // VOLTA PRO FLUXO ORIGINAL: pedido -> pagamento (QR Code) -> pedidos
      router.push(`/pagamento?id=${pedido.id}`);
    } catch (e: any) {
      alert("Erro ao finalizar: " + e.message);
    } finally {
      setFinalizando(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-[#0B1325] text-white flex items-center justify-center">Carregando pedido...</div>;

  return (
    <div className="min-h-screen bg-[#0B1325] p-4 md:p-8 text-white">
      <h1 className="text-3xl font-black text-[#E2C9A1] mb-6">Pedido - Total: R$ {total.toFixed(2)}</h1>

      {carrinho.length === 0 ? (
        <div className="mt-20 text-center">
          <p className="text-white/60 text-xl mb-6">Carrinho vazio</p>
          <Link href="/catalogo" className="bg-[#E2C9A1] text-black px-8 py-4 rounded-xl font-black inline-block">Ver Catálogo</Link>
        </div>
      ) : (
        <div className="max-w-3xl mx-auto">
          <div className="grid gap-3 mb-8">
            {carrinho.map((item: any) => (
              <div key={item.id} className="bg-[#162342] p-4 rounded-xl flex gap-4 items-center border border-white/10">
                <img src={item.produtos?.imagem_url || "/placeholder.png"} className="w-20 h-20 object-contain bg-black/30 rounded-lg" />
                <div className="flex-1">
                  <p className="font-bold text-[#E2C9A1]">{item.produtos?.nome}</p>
                  <p className="text-sm text-zinc-400">R$ {Number(item.produtos?.preco).toFixed(2)} cada</p>
                  <p className="text-xs text-zinc-500">Estoque restante: {item.produtos?.estoque}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => diminuir(item)} className="w-9 h-9 bg-white/10 rounded-lg font-black hover:bg-white/20">-</button>
                  <span className="w-8 text-center font-bold">{item.quantidade}</span>
                  <button onClick={() => aumentar(item)} className="w-9 h-9 bg-[#E2C9A1] text-black rounded-lg font-black hover:bg-white">+</button>
                </div>
                <button onClick={() => removerCarrinho(item.id).then(carregar)} className="ml-2 text-red-400 hover:text-red-300 px-2">X</button>
              </div>
            ))}
          </div>

          <div className="bg-[#162342] p-6 rounded-xl border border-[#E2C9A1]/20">
            <div className="flex justify-between text-lg mb-4">
              <span className="text-zinc-400">Subtotal ({carrinho.length} itens)</span>
              <span className="font-bold text-[#E2C9A1]">R$ {total.toFixed(2)}</span>
            </div>
            <button 
              onClick={finalizar}
              disabled={finalizando}
              className="w-full bg-[#E2C9A1] text-black py-4 rounded-xl font-black text-lg hover:bg-white disabled:opacity-50"
            >
              {finalizando ? "Processando..." : `FINALIZAR E IR PARA PAGAMENTO - R$ ${total.toFixed(2)}`}
            </button>
            <Link href="/catalogo" className="w-full mt-3 bg-white/10 py-3 rounded-xl font-bold text-center block hover:bg-white/20">Continuar comprando</Link>
          </div>
        </div>
      )}
    </div>
  );
}