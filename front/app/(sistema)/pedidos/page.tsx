"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

type Pedido = {
  id: string;
  total: number;
  status: string;
  itens: any[];
  created_at?: string;
}

const STATUS_FLOW = ["pendente", "pago", "preparando", "enviado", "entregue"];

function statusColor(s: string) {
  const v = s?.toLowerCase();
  if (v === "pago") return "text-green-400";
  if (v === "pendente") return "text-yellow-400";
  if (v === "preparando") return "text-blue-400";
  if (v === "enviado") return "text-purple-400";
  if (v === "entregue") return "text-emerald-300";
  return "text-zinc-400";
}

export default function PedidosPage() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [aberto, setAberto] = useState<string | null>(null);

  const carregar = async () => {
    const { data } = await supabase.from("pedidos").select("*").order("id", { ascending: false });
    if (data) setPedidos(data.map((p: any) => ({...p, total: Number(p.total || 0) })));
    setLoading(false);
  };

  useEffect(() => {
    carregar();

    // TEMPO REAL: escuta mudança na tabela pedidos
    const channel = supabase
     .channel("pedidos-realtime")
     .on("postgres_changes", { event: "*", schema: "public", table: "pedidos" }, (payload) => {
        console.log("Atualização em tempo real:", payload);
        if (payload.eventType === "UPDATE") {
          setPedidos((prev) => prev.map((p) => p.id === payload.new.id? {...p,...payload.new, total: Number(payload.new.total) } as Pedido : p));
        }
        if (payload.eventType === "INSERT") {
          setPedidos((prev) => [{...payload.new, total: Number(payload.new.total) } as Pedido,...prev]);
        }
      })
     .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (loading) return <div className="min-h-screen bg-[#0B1325] text-white flex items-center justify-center">Carregando...</div>;

  return (
    <div className="min-h-screen bg-[#0B1325] p-4 md:p-6 text-white">
      <div className="flex justify-between mb-6 items-center">
        <h1 className="text-2xl font-black text-[#E2C9A1]">Meus Pedidos - {pedidos.length}</h1>
        <div className="flex gap-2">
          <Link href="/catalogo" className="bg-white/10 px-4 py-2 rounded-lg text-sm">Catálogo</Link>
          <Link href="/pedido" className="bg-[#E2C9A1] text-black px-4 py-2 rounded-lg text-sm font-bold">Carrinho</Link>
        </div>
      </div>

      <div className="max-w-3xl mx-auto grid gap-4">
        {pedidos.map((p) => {
          const idx = STATUS_FLOW.indexOf(p.status?.toLowerCase());
          return (
            <div key={p.id} className="bg-[#162342] rounded-xl border border-white/10 overflow-hidden">
              <div onClick={() => setAberto(aberto === p.id? null : p.id)} className="p-5 cursor-pointer hover:bg-white/[0.03]">
                <div className="flex justify-between">
                  <div>
                    <p className="text-xs text-zinc-500">ID: {String(p.id).slice(0,8)} {p.created_at? `- ${new Date(p.created_at).toLocaleString("pt-BR")}` : ""}</p>
                    <p className="font-bold text-[#E2C9A1] text-xl">R$ {Number(p.total || 0).toFixed(2)}</p>
                    <p className="text-sm mt-1">Status: <span className={`font-bold uppercase ${statusColor(p.status)}`}>{p.status}</span> <span className="ml-2 text-[10px] bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full animate-pulse">TEMPO REAL</span></p>
                  </div>
                  <span className="text-zinc-500">{aberto === p.id? "▲" : "▼"}</span>
                </div>

                {/* Linha do tempo */}
                <div className="flex gap-1 mt-4">
                  {STATUS_FLOW.map((s, i) => (
                    <div key={s} className={`h-1.5 flex-1 rounded-full ${i <= idx? "bg-[#E2C9A1]" : "bg-white/10"}`} title={s}></div>
                  ))}
                </div>
                <div className="flex justify-between mt-1">
                  {STATUS_FLOW.map((s) => (
                    <span key={s} className="text-[9px] uppercase text-zinc-500">{s}</span>
                  ))}
                </div>
              </div>

              {aberto === p.id && (
                <div className="bg-black/20 p-5 border-t border-white/10">
                  <p className="text-xs text-zinc-400 mb-2 font-bold">ITENS DO PEDIDO:</p>
                  {Array.isArray(p.itens) && p.itens.length > 0? (
                    <div className="grid gap-2">
                      {p.itens.map((it: any, i: number) => (
                        <div key={i} className="flex justify-between text-sm bg-white/5 p-2 rounded">
                          <span>{it.nome || it.produtoId} x{it.quantidade}</span>
                          <span className="text-[#E2C9A1]">R$ {Number(it.preco || 0).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-zinc-500">Sem detalhes dos itens (pedido antigo)</p>
                  )}

                  {p.status?.toLowerCase() === "pendente" && (
                    <Link href={`/pagamento?id=${p.id}`} className="mt-4 block w-full text-center bg-yellow-500 text-black py-3 rounded-xl font-black">PAGAR AGORA - VER QR CODE</Link>
                  )}
                  {p.status?.toLowerCase() === "pago" && (
                    <div className="mt-4 text-center text-green-400 text-sm font-bold">✓ Pagamento confirmado! Preparando seu pedido...</div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}