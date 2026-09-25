"use client";

import { useState, useEffect } from "react"; // 2. Estado + carregar ao abrir
import { createClient } from "@supabase/supabase-js"; // 3. Cria cliente Supabase aqui pra não dar erro de import
import { useRouter } from "next/navigation"; // 4. router.push()

// 5. Cria Supabase aqui pra não dar erro de import igual antes
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!, // 6. URL do Supabase
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY! // 7. Anon key
);

export default function PagamentoPage() { // 8. Rota /pedido ou /pagamento - tela final de pagar
  const [carrinho, setCarrinho] = useState<any[]>([]); // 9. Carrinho com produtos joinados
  const [metodo, setMetodo] = useState<"pix" | "cartao">("pix"); // 10. PIX ou CARTAO - começa PIX
  const [loading, setLoading] = useState(false); // 11. Trava botão enquanto cria pedido
  const router = useRouter(); // 12. Navegação

  // 13. Carrega carrinho do Supabase - SELECT * FROM carrinho + produtos
  const carregarCarrinho = async () => {
    const { data } = await supabase.from("carrinho").select("*, produtos(*)").order("created_at", { ascending: false }); // 14. Busca carrinho com join produtos
    if (data) setCarrinho(data); // 15. Guarda
  };

  useEffect(() => { carregarCarrinho(); }, []); // 16. Carrega 1x ao abrir página

  const total = carrinho.reduce((acc, item) => acc + (item.produtos.preco * item.quantidade), 0); // 17. Soma total do carrinho

  // 18. Função final do TCC - cria pedido e da baixa no estoque - É AQUI QUE A BANCA OLHA
  const finalizarPagamento = async () => {
    if (carrinho.length === 0) return alert("Carrinho vazio!"); // 19. Validação
    setLoading(true); // 20. Liga loading

    try {
      // 21. 1. Cria pedido na tabela pedidos - INSERT INTO pedidos
      const { data: pedido, error } = await supabase.from("pedidos").insert([{
        total: total, // 22. Total calculado
        itens: carrinho, // 23. Salva o carrinho inteiro como JSON - guarda snapshot do que foi comprado
        status: metodo === "pix"? "pago" : "pago", // 24. Simula pagamento aprovado - pros dois já vira pago (TCC)
        metodo_pagamento: metodo // 25. pix ou cartao
      }]).select().single(); // 26..select().single() devolve o pedido criado pra pegar o id

      if (error) throw error; // 27. Se deu erro no INSERT

      // 28. 2. Da baixa no estoque dos Pals vendidos - UPDATE produtos SET estoque = estoque - qtd
      for (const item of carrinho) { // 29. Loop item a item do carrinho
        const novoEstoque = item.produtos.estoque - item.quantidade; // 30. Calcula novo estoque
        await supabase.from("produtos").update({
          estoque: novoEstoque, // 31. Atualiza estoque
          ativo_na_loja: novoEstoque > 0 // 32. Se zerou, sai da loja - não aparece mais no catálogo
        }).eq("id", item.produto_id); // 33. WHERE id = produto_id
      }

      // 34. 3. Limpa carrinho - DELETE FROM carrinho
      await supabase.from("carrinho").delete().gt("quantidade", 0); // 35. Deleta tudo que tem qtd > 0 (ou seja, tudo)

      alert(`Pagamento ${metodo.toUpperCase()} aprovado! Pedido #${pedido.id.slice(0,8)}`); // 36. Mostra id curto do pedido
      router.push("/pedidos"); // 37. Vai pra meus pedidos - navegabilidade exigida

    } catch (e: any) { // 38. Erro
      alert("Erro: " + e.message);
    } finally { // 39. Sempre desliga loading
      setLoading(false);
    }
  };

  return (
    // 40. JSX - Tela dividida em 2: escolher método | resumo
    <div className="min-h-screen bg-[#0B1325] p-4 md:p-8 text-white">
      <h1 className="text-2xl font-black text-[#E2C9A1] mb-6">Método de Pagamento</h1>

      <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {/* 41. Escolher método */}
        <div className="bg-[#162342] p-6 rounded-2xl border border-white/10">
          <h2 className="font-bold mb-4">Escolha como pagar</h2>

          <button onClick={()=>setMetodo("pix")} className={`w-full p-4 rounded-xl border mb-3 text-left ${metodo==="pix"? "bg-[#E2C9A1] text-black border-[#E2C9A1]" : "bg-[#0B1325] border-white/10"}`}>
            <p className="font-bold">PIX - Aprovação Instantânea</p>
            <p className="text-xs">QR Code gerado na hora</p>
          </button>

          <button onClick={()=>setMetodo("cartao")} className={`w-full p-4 rounded-xl border text-left ${metodo==="cartao"? "bg-[#E2C9A1] text-black border-[#E2C9A1]" : "bg-[#0B1325] border-white/10"}`}>
            <p className="font-bold">Cartão de Crédito</p>
            <p className="text-xs">Simulado para o TCC</p>
          </button>

          {metodo==="pix" && ( // 42. Só mostra QR se método = pix
            <div className="mt-6 bg-white p-4 rounded-xl text-black text-center">
              <p className="text-xs">QR CODE PIX SIMULADO</p>
              <div className="w-40 h-40 bg-black/10 mx-auto my-2 flex items-center justify-center text-[10px]">QR CODE AQUI</div>
              <p className="text-[10px]">Copia e cola: 00020126...</p>
            </div>
          )}
        </div>

        {/* 43. Resumo */}
        <div className="bg-[#162342] p-6 rounded-2xl border border-white/10 h-fit">
          <h2 className="font-bold mb-4">Resumo do Pedido</h2>
          {carrinho.map(item => (
            <div key={item.id} className="flex justify-between text-sm mb-2">
              <span>{item.produtos.nome} x{item.quantidade}</span>
              <span>R$ {(item.produtos.preco * item.quantidade).toFixed(2)}</span>
            </div>
          ))}
          <div className="border-t border-white/10 mt-4 pt-4 flex justify-between font-black text-[#E2C9A1]">
            <span>Total</span>
            <span>R$ {total.toFixed(2)}</span>
          </div>

          <button onClick={finalizarPagamento} disabled={loading} className="w-full mt-6 bg-[#E2C9A1] text-black py-4 rounded-xl font-black">
            {loading? "Processando..." : `PAGAR COM ${metodo.toUpperCase()} - R$ ${total.toFixed(2)}`}
          </button>
        </div>
      </div>
    </div>
  );
}