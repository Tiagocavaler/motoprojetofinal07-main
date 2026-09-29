"use client";

import { useState, useEffect } from "react"; // 2. Estado + carregar ao abrir
import Link from "next/link"; // 3. Navegação

const ETAPAS = [ // 4. Timeline do pedido - 4 passos que a banca quer ver
  { id: "pago", titulo: "Pagamento Aprovado", desc: "Pagamento confirmado" }, // 5. Etapa 1
  { id: "embalando", titulo: "Sendo Embalado", desc: "Preparando seu Pal" }, // 6. Etapa 2
  { id: "saiu_para_entrega", titulo: "Saiu para Entrega", desc: "A caminho" }, // 7. Etapa 3
  { id: "entregue", titulo: "Entregue", desc: "Entregue!" }, // 8. Etapa 4 final
];

export default function MeusPedidosPage() { // 9. Página /pedidos
  const [pedidos, setPedidos] = useState<any[]>([]); // 10. Lista de pedidos do localStorage

  useEffect(() => { // 11. Ao abrir a página
    // 12. Lê do navegador onde salvamos no passo 1 - no finalizar() da página anterior
    const salvos = JSON.parse(localStorage.getItem("meus_pedidos") || "[]"); // 13. Pega do localStorage ou array vazio
    setPedidos(salvos); // 14. Guarda pra renderizar
  }, []);

  if (pedidos.length === 0) { // 15. Se não tem pedido
    return (
      <div className="min-h-screen bg-[#0B1325] flex items-center justify-center">
        <div className="bg-[#1A2A4A] p-8 rounded-2xl text-center">
          <p className="text-white/60 mb-4">Nenhum pedido encontrado ainda</p>
          <Link href="/catalogo" className="bg-[#E2C9A1] text-black px-6 py-3 rounded-xl font-bold">Ver Catálogo</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B1325] p-6 text-white">
      <h1 className="text-2xl font-black text-[#E2C9A1] mb-6">Meus Pedidos</h1>
      <div className="grid gap-6 max-w-4xl mx-auto">
        {pedidos.map(pedido => { // 16. Loop nos pedidos
          const etapaAtualIndex = ETAPAS.findIndex(e => e.id === pedido.status); // 17. Acha em que etapa está - 0 a 3
          return (
            <div key={pedido.id} className="bg-[#162342] p-6 rounded-2xl border border-white/10">
              <div className="flex justify-between mb-6">
                <p className="font-black text-[#E2C9A1]">Pedido #{pedido.id}</p>
                <p>R$ {Number(pedido.total).toFixed(2)}</p>
              </div>
              <div className="relative flex justify-between mb-6"> {/* 18. Barra de progresso */}
                <div className="absolute top-4 left-0 right-0 h-1 bg-white/10"></div> {/* 19. Linha de fundo cinza */}
                <div className="absolute top-4 left-0 h-1 bg-[#E2C9A1]" style={{width: `${(etapaAtualIndex/(ETAPAS.length-1))*100}%`}}></div> {/* 20. Linha dourada preenchida até etapa atual */}
                {ETAPAS.map((etapa, index) => { // 21. Bolinhas das etapas
                  const concluida = index <= etapaAtualIndex; // 22. Se já passou ou é a atual, marca como concluída
                  return (
                    <div key={etapa.id} className="flex flex-col items-center z-10 w-1/4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${concluida?"bg-[#E2C9A1] text-black":"bg-[#0B1325] border border-white/20 text-white/40"}`}>{concluida?"✓":index+1}</div> {/* 23. Bolinha com check ou número */}
                      <p className="text-[10px] mt-2 text-center font-bold">{etapa.titulo}</p>
                    </div>
                  );
                })}
              </div>
              <div className="bg-[#0B1325] p-3 rounded-xl text-sm"> {/* 24. Itens do pedido */}
                {pedido.itens?.map((item:any,i:number)=><div key={i}>{item.quantidade}x {item.produtos?.nome}</div>)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}