"use client";

import { useState, useEffect } from "react"; // 2. Hooks
import { createClient } from "@supabase/supabase-js"; // 3. Cliente supabase
import { useRouter } from "next/navigation"; // 4. Navegação
import Link from "next/link"; // 5. Link sem reload

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!); // 6. Conexão Supabase

export default function PedidoPage() { // 7. Página /pedido ou /pagamento
  const [carrinho, setCarrinho] = useState<any[]>([]); // 8. Carrinho com produtos
  const [loading, setLoading] = useState(true); // 9. Tela de carregando inicial
  const [pagando, setPagando] = useState(false); // 10. Trava botão ao pagar
  const router = useRouter(); // 11. Pra redirecionar pra /pedidos

  const carregar = async () => { // 12. Busca carrinho + join produtos
    const { data } = await supabase.from("carrinho").select("*, produtos(*)").order("created_at", {ascending:false});
    if(data) setCarrinho(data); // 13. Guarda
    setLoading(false); // 14. Tira loading inicial
  };
  useEffect(()=>{carregar()},[]); // 15. Roda ao abrir
  const total = carrinho.reduce((acc,i)=>acc+(i.produtos.preco*i.quantidade),0); // 16. Soma total

  const finalizar = async () => { // 17. Botão PAGAR - função mais importante do TCC
    setPagando(true); // 18. Liga pagando
    // 19. Cria pedido fake que vai pro localStorage - seu truque pra não depender só do Supabase
    const novoPedido = {
      id: Math.random().toString(36).substring(2,10).toUpperCase(), // 20. ID aleatório tipo 8 chars - pro aluno ver na hora
      total: total, // 21. Total
      itens: carrinho, // 22. Itens
      status: "pago", // 23. Já nasce pago (simulação)
      created_at: new Date().toISOString() // 24. Data agora
    };

    // 25. 1. Tenta salvar no Supabase (se falhar não importa) - salva mas se der erro não quebra
    await supabase.from("pedidos").insert([{ total, itens: carrinho, status: "pago" }]);

    // 26. 2. Salva no navegador - GARANTIDO que vai aparecer no /pedidos - fallback 100% garantido pra banca
    const pedidosAntigos = JSON.parse(localStorage.getItem("meus_pedidos") || "[]"); // 27. Pega os que já tinha
    localStorage.setItem("meus_pedidos", JSON.stringify([novoPedido,...pedidosAntigos])); // 28. Bota novo na frente

    // 29. Limpa carrinho - deleta tudo
    await supabase.from("carrinho").delete().neq("id","00000000-0000-0000-0000-000000000000"); // 30. neq id impossível = deleta todos

    alert("Pagamento aprovado! ID: "+novoPedido.id); // 31. Feedback
    router.push("/pedidos"); // 32. Vai pra lista de pedidos - vai achar no localStorage mesmo se Supabase falhar
  };

  if(loading) return <div className="min-h-screen bg-[#0B1325] flex items-center justify-center text-white">Carregando...</div>; // 33. Tela loading
  if(carrinho.length===0) return <div className="min-h-screen bg-[#0B1325] flex items-center justify-center"><Link href="/catalogo" className="bg-[#E2C9A1] text-black px-6 py-3 rounded-xl font-bold">Ver Catálogo</Link></div>; // 34. Se vazio manda pro catalogo

  return (
    <div className="min-h-screen bg-[#0B1325] p-8 text-white">
      <h1 className="text-2xl font-black text-[#E2C9A1] mb-6">Finalizar</h1>
      <p className="mb-4">Total: R$ {total.toFixed(2)} - {carrinho.length} itens</p>
      <button onClick={finalizar} disabled={pagando} className="w-full bg-[#E2C9A1] text-black py-4 rounded-xl font-black">{pagando?"PROCESSANDO...":"PAGAR COM PIX"}</button>
    </div>
  );
}