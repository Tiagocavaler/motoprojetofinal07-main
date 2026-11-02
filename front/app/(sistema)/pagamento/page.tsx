"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

function gerarPixPayload(chave: string, valor: number, nome = "PAL STORE", cidade = "CRICIUMA") {
  const payload = `00020126580014BR.GOV.BCB.PIX0114${chave}520400005303986540${valor.toFixed(2)}5802BR5913${nome}6009${cidade}62070503***6304`;
  return payload;
}

function PagamentoContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [pedido, setPedido] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if(!id) return;
    supabase.from("pedidos").select("*").eq("id", id).single().then(({data, error}) => {
      if(!error) setPedido(data);
    });
  }, [id]);

  if(!pedido) return <div className="min-h-screen bg-[#0B1325] text-white flex items-center justify-center">Carregando pagamento...</div>;

  const pixCopiaCola = gerarPixPayload("08134695973", Number(pedido.total));
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(pixCopiaCola)}`;

  // ===== NOVO FLUXO SEGURO: CLIENTE AVISA, ADMIN CONFIRMA =====
  const confirmar = async () => {
    if(loading) return;
    setLoading(true);
    try {
      // 1. NÃO marca como pago, só avisa que cliente diz que pagou
      const { error } = await supabase.from("pedidos").update({ status: 'AGUARDANDO_CONFIRMACAO' }).eq("id", pedido.id).select();
      if (error) throw error;

      // 2. Avisa o Java pra mandar email pro admin firestorm134679@gmail.com
      try {
        await fetch(`http://localhost:8081/pedidos/${pedido.id}/avisar-pagamento`, { method: 'POST' });
      } catch(e) {
        console.log("Aviso admin via Java offline, mas status já atualizado no Supabase");
      }

      alert("Obrigado! Avisamos o admin que você pagou o pedido " + String(pedido.id).slice(0,8) + ". Assim que ele confirmar que recebeu o PIX de R$ " + Number(pedido.total).toFixed(2) + ", você recebe email de pagamento APROVADO!");
      router.push("/pedidos");
    } catch (e:any) {
      alert("Erro ao avisar: " + (e?.message || e));
      setLoading(false);
    }
  };

  const copiar = async () => {
    await navigator.clipboard.writeText(pixCopiaCola);
    alert("Código PIX copiado!");
  };

  return (
    <div className="min-h-screen bg-[#0B1325] p-6 text-white flex flex-col items-center">
      <h1 className="text-3xl font-black text-[#E2C9A1] mb-2">Pagamento PIX</h1>
      <p className="text-zinc-400 mb-6">Pedido {String(pedido.id).slice(0,8)} - R$ {Number(pedido.total).toFixed(2)}</p>

      <div className="bg-white p-4 rounded-2xl">
        <img src={qrUrl} alt="QR Code PIX" className="w-[300px] h-[300px]" crossOrigin="anonymous" referrerPolicy="no-referrer" />
      </div>

      <div className="max-w-md w-full mt-6 bg-[#162342] p-4 rounded-xl">
        <p className="text-xs text-zinc-500 mb-2">PIX Copia e Cola:</p>
        <p className="text-xs break-all bg-black/30 p-3 rounded select-all">{pixCopiaCola}</p>
        <button onClick={copiar} className="w-full mt-3 bg-white/10 py-2 rounded-lg font-bold hover:bg-white/20">Copiar código</button>
      </div>

      <button onClick={confirmar} disabled={loading} className="max-w-md w-full mt-6 bg-green-600 py-4 rounded-xl font-black text-lg hover:bg-green-700 disabled:opacity-50">
        {loading ? "AVISANDO ADMIN..." : "JÁ PAGUEI - AVISAR ADMIN"}
      </button>
      <p className="mt-3 text-zinc-400 text-xs text-center max-w-md">Após clicar, o admin {`firestorm134679@gmail.com`} receberá um email para confirmar que recebeu o PIX. Você será notificado por email quando for aprovado.</p>
      <Link href="/pedidos" className="mt-3 text-zinc-400 text-sm hover:text-white">Acompanhar pedido depois</Link>
    </div>
  );
}

export default function PagamentoPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0B1325] flex items-center justify-center text-white">Carregando pagamento...</div>}>
      <PagamentoContent />
    </Suspense>
  );
}