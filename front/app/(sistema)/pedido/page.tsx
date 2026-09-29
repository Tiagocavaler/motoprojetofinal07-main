"use client";

import { useState, useEffect, useRef } from "react"; // 2. Hooks
import { createClient } from "@supabase/supabase-js"; // 3. Cliente supabase
import { useRouter } from "next/navigation"; // 4. Navegação
import Link from "next/link"; // 5. Link sem reload
import { QRCodeSVG } from "qrcode.react"; // 6. Lib QRCode

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!); // 7. Conexão

export default function PedidoPage() { // 8. Página /pedido
  const [carrinho, setCarrinho] = useState<any[]>([]); // 9. Carrinho
  const [loading, setLoading] = useState(true); // 10. Loading inicial
  const [pagando, setPagando] = useState(false); // 11. Trava botão
  const [pixCopiaECola, setPixCopiaECola] = useState<string | null>(null); // 12. Código PIX
  const [pedidoTemp, setPedidoTemp] = useState<any>(null); // 13. Pedido temporário
  const [statusPix, setStatusPix] = useState("Aguardando pagamento..."); // 14. Status
  const [tempoRestante, setTempoRestante] = useState(600); // 15. 10 minutos = 600s
  const [tempoAprovado, setTempoAprovado] = useState(15); // 16. [NOVO] Contador de 15s após aprovação
  const [foiAprovado, setFoiAprovado] = useState(false); // 17. [NOVO] Controla se já foi aprovado
  const intervalRef = useRef<NodeJS.Timeout | null>(null); // 18. Guarda intervalo 10 min
  const timeoutCancelRef = useRef<NodeJS.Timeout | null>(null); // 19. Guarda timeout cancelamento
  const router = useRouter(); // 20. Navegação

  const carregar = async () => { // 21. Busca carrinho
    const { data } = await supabase.from("carrinho").select("*, produtos(*)").order("created_at", {ascending:false});
    if(data) setCarrinho(data);
    setLoading(false);
  };
  useEffect(()=>{carregar()},[]);
  const total = carrinho.reduce((acc,i)=>acc+(i.produtos.preco*i.quantidade),0); // 22. Total

  // 23. Payload PIX - chave 08134695973 só no código, nunca exposta na tela
  const gerarPixPayload = (chave: string, valor: number) => {
    const valorFormatado = valor.toFixed(2);
    const payload = `00020126580014BR.GOV.BCB.PIX0136${chave}52040000530398654${String(valorFormatado).length.toString().padStart(2,'0')}${valorFormatado}5802BR5913PAL STORE LTDA6008CRICIUMA62070503***6304`;
    const calcularCRC16 = (str: string) => {
      let crc = 0xFFFF;
      for (let i = 0; i < str.length; i++) {
        crc ^= str.charCodeAt(i) << 8;
        for (let j = 0; j < 8; j++) {
          crc = (crc & 0x8000)? (crc << 1) ^ 0x1021 : crc << 1;
        }
      }
      return (crc & 0xFFFF).toString(16).toUpperCase().padStart(4, '0');
    };
    return payload + calcularCRC16(payload);
  };

  const handleCancelamentoPorTempo = () => { // 24. Cancela após 10 min
    setStatusPix("Tempo esgotado! Pedido cancelado.");
    alert("Tempo de 10 minutos esgotado. Pedido cancelado por falta de pagamento.");
    setPixCopiaECola(null);
    setPedidoTemp(null);
    if(intervalRef.current) clearInterval(intervalRef.current);
    router.push("/"); // 25. Volta pra home
  };

  const confirmarPagamento = async () => { // 26. [ALTERADO] Agora tem espera de 15s quando aprovado
    if(!pedidoTemp) return;
    if(intervalRef.current) clearInterval(intervalRef.current); // 27. Para contador de 10 min
    if(timeoutCancelRef.current) clearTimeout(timeoutCancelRef.current); // 28. Cancela timeout de cancelamento

    setFoiAprovado(true); // 29. [NOVO] Marca como aprovado pra trocar a UI
    setTempoAprovado(15); // 30. [NOVO] Reseta contador de 15s
    setStatusPix("Pagamento aprovado! ✅"); // 31. [NOVO] Status de aprovado

    // 32. [NOVO] Salva pedido no Supabase e localStorage
    await supabase.from("pedidos").insert([{ total, itens: carrinho, status: "pago" }]);
    const pedidosAntigos = JSON.parse(localStorage.getItem("meus_pedidos") || "[]");
    localStorage.setItem("meus_pedidos", JSON.stringify([pedidoTemp,...pedidosAntigos]));
    await supabase.from("carrinho").delete().neq("id","00000000-0000-0000-0000-000000000000");

    // 33. [NOVO] A espera de 15 segundos será feita no useEffect abaixo que observa foiAprovado
  };

  // 34. Efeito do timer de 10 minutos + simulação de aprovação
  useEffect(() => {
    if (!pixCopiaECola ||!pedidoTemp || foiAprovado) return;

    setTempoRestante(600);
    intervalRef.current = setInterval(() => {
      setTempoRestante((prev) => {
        if (prev <= 1) {
          if(intervalRef.current) clearInterval(intervalRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    timeoutCancelRef.current = setTimeout(() => {
      handleCancelamentoPorTempo();
    }, 600000); // 35. 10 minutos

    // 36. SIMULAÇÃO PARA TCC: simula que o banco aprovou após 20s
    const timeoutSimulacaoAprovacao = setTimeout(() => {
      confirmarPagamento();
    }, 20000); // 37. Cliente "paga" em 20s, depois entra nos 15s de espera

    return () => {
      if(intervalRef.current) clearInterval(intervalRef.current);
      if(timeoutCancelRef.current) clearTimeout(timeoutCancelRef.current);
      clearTimeout(timeoutSimulacaoAprovacao);
    };
  }, [pixCopiaECola, pedidoTemp]);

  // 38. [NOVO] Efeito que cuida dos 15 segundos de espera APÓS aprovação
  useEffect(() => {
    if (!foiAprovado) return;
    const intervalAprovado = setInterval(() => {
      setTempoAprovado((prev) => {
        if (prev <= 1) {
          clearInterval(intervalAprovado);
          router.push("/pedidos"); // 39. [NOVO] Após 15s vai pra lista de pedidos
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(intervalAprovado);
  }, [foiAprovado]);

  const handleGerarPix = () => {
    setPagando(true);
    const novoPedido = {
      id: Math.random().toString(36).substring(2,10).toUpperCase(),
      total: total,
      itens: carrinho,
      status: "pago",
      created_at: new Date().toISOString()
    };
    setPedidoTemp(novoPedido);
    const codigoPix = gerarPixPayload("08134695973", total);
    setPixCopiaECola(codigoPix);
    setFoiAprovado(false);
    setPagando(false);
  };

  const formatarTempo = (seg: number) => { // 40. Formata mm:ss
    const m = Math.floor(seg / 60).toString().padStart(2, '0');
    const s = (seg % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  if(loading) return <div className="min-h-screen bg-[#0B1325] flex items-center justify-center text-white">Carregando...</div>;
  if(carrinho.length===0) return <div className="min-h-screen bg-[#0B1325] flex items-center justify-center"><Link href="/catalogo" className="bg-[#E2C9A1] text-black px-6 py-3 rounded-xl font-bold">Ver Catálogo</Link></div>;

  return (
    <div className="min-h-screen bg-[#0B1325] p-8 text-white">
      <h1 className="text-2xl font-black text-[#E2C9A1] mb-6">Finalizar</h1>
      <p className="mb-4">Total: R$ {total.toFixed(2)} - {carrinho.length} itens</p>

      {!pixCopiaECola? (
        <button onClick={handleGerarPix} disabled={pagando} className="w-full bg-[#E2C9A1] text-black py-4 rounded-xl font-black">{pagando?"GERANDO QRCODE...":"PAGAR COM PIX"}</button>
      ) : (
        <div className="bg-white p-6 rounded-2xl text-center text-black">
          <h2 className="font-black text-lg mb-1">{foiAprovado? "Pagamento Aprovado!" : "Escaneie para pagar"}</h2>
          <p className="text-sm text-gray-500 mb-4">{foiAprovado? "Obrigado pela compra!" : "Pagamento 100% seguro via PIX"}</p>

          <div className={`flex justify-center bg-white p-4 rounded-xl border ${foiAprovado? "opacity-50" : ""}`}>
            <QRCodeSVG value={pixCopiaECola} size={220} />
          </div>

          <div className="mt-6">
            {!foiAprovado? (
              <>
                <div className="flex items-center justify-center gap-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
                  <p className="font-bold text-gray-700">{statusPix}</p>
                </div>
                <div className="mt-3 bg-gray-100 py-2 px-4 rounded-full inline-block">
                  <p className="text-sm font-mono font-bold text-gray-800">Expira em: {formatarTempo(tempoRestante)}</p>
                </div>
                <p className="text-[11px] text-gray-400 mt-3">Se não houver confirmação em 10 minutos, o pedido será cancelado</p>
              </>
            ) : (
              <>
                {/* 41. [NOVO] Tela de espera de 15s após aprovação */}
                <div className="flex items-center justify-center gap-2">
                  <div className="w-3 h-3 bg-green-600 rounded-full animate-pulse"></div>
                  <p className="font-bold text-green-700">Pagamento confirmado com sucesso!</p>
                </div>
                <div className="mt-3 bg-green-50 py-3 px-4 rounded-xl border border-green-200">
                  <p className="text-sm font-bold text-green-800">Redirecionando em {tempoAprovado}s...</p>
                  <p className="text-xs text-green-600 mt-1">Estamos gerando sua nota e liberando o pedido</p>
                </div>
              </>
            )}
          </div>

          {!foiAprovado && (
            <button onClick={()=>{
              if(intervalRef.current) clearInterval(intervalRef.current);
              if(timeoutCancelRef.current) clearTimeout(timeoutCancelRef.current);
              setPixCopiaECola(null);
              router.push("/");
            }} className="w-full text-gray-500 py-3 mt-4 text-sm">Cancelar pedido e voltar pra home</button>
          )}
        </div>
      )}
    </div>
  );
}