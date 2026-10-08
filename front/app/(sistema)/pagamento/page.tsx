"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

function gerarPixPayload(chave: string, valor: number, nome = "PAL STORE", cidade = "CRICIUMA") {
  // payload PIX simplificado - chave 08134695973 só aqui no código
  const valorFmt = valor.toFixed(2);
  // EMV padrão
  const payload = `00020126580014BR.GOV.BCB.PIX0114${chave}520400005303986540${valorFmt}5802BR5913${nome}6009${cidade}62070503***6304`;
  return payload;
}

export default function PagamentoPage() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [pedido, setPedido] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    if(!id) return;
    supabase.from("pedidos").select("*").eq("id", id).single().then(({data}) => setPedido(data));
  }, [id]);

  if(!pedido) return <div className="min-h-screen bg-[#0B1325] text-white flex items-center justify-center">Carregando pagamento...</div>;

  const pixCopiaCola = gerarPixPayload("08134695973", Number(pedido.total));
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(pixCopiaCola)}`;

  const confirmar = async () => {
    await supabase.from("pedidos").update({ status: 'pago' }).eq("id", pedido.id);
    router.push("/pedidos");
  };

  return (
    <div className="min-h-screen bg-[#0B1325] p-6 text-white flex flex-col items-center">
      <h1 className="text-3xl font-black text-[#E2C9A1] mb-2">Pagamento PIX</h1>
      <p className="text-zinc-400 mb-6">Pedido {String(pedido.id).slice(0,8)} - R$ {Number(pedido.total).toFixed(2)}</p>

      <div className="bg-white p-4 rounded-2xl">
        <img src={qrUrl} alt="QR Code PIX" className="w-[300px] h-[300px]" />
      </div>

      <div className="max-w-md w-full mt-6 bg-[#162342] p-4 rounded-xl">
        <p className="text-xs text-zinc-500 mb-2">PIX Copia e Cola:</p>
        <p className="text-xs break-all bg-black/30 p-3 rounded select-all">{pixCopiaCola}</p>
        <button onClick={() => navigator.clipboard.writeText(pixCopiaCola)} className="w-full mt-3 bg-white/10 py-2 rounded-lg font-bold">Copiar código</button>
      </div>

      <button onClick={confirmar} className="max-w-md w-full mt-6 bg-green-600 py-4 rounded-xl font-black text-lg">JÁ PAGUEI - CONFIRMAR</button>
      <Link href="/pedidos" className="mt-3 text-zinc-400 text-sm">Acompanhar pedido depois</Link>
    </div>
  );
}