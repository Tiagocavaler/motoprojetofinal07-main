// 1. Status é String no seu Java, não Enum: "PENDENTE" ou "ENTREGUE" - por isso type e não enum
export type StatusPedido = "PENDENTE" | "ENTREGUE";

// 2. O que o front MANDA pro Java criar
// 3. No Java você tem: private Cliente cliente e private List<Produto> produtos
// 4. Então mandamos só os IDs - Java busca no banco e monta o objeto
export interface PedidoRequest {
  clienteId: number; // 5. vai virar o objeto Cliente no Java - seu service faz clienteRepository.findById()
  produtosIds: number[]; // 6. vai virar a List<Produto> no Java - seu service faz produtoRepository.findAllById()
  status: StatusPedido; // 7. PENDENTE quando cria, depois vira ENTREGUE no admin
}

// 8. O que o Java DEVOLVE pro front
export interface PedidoResponse {
  id: number; // 9. Long no Java, number no TS
  dataPedido: string; // 10. LocalDateTime vem como string - "2026-05-13T19:30:00"
  status: string; // 11. Status que foi salvo
  cliente: { // 12. Objeto cliente que o Java retorna - já populado
    id: number; // 13. id do cliente
    nome: string; // 14. nome do cliente pra mostrar no pedido
  };
  produtos: { // 15. Lista de produtos do pedido
    id: number; // 16. id do produto
    nome: string; // 17. ou nome da sua entidade Produto - nome pra mostrar na tabela
  }[];
}