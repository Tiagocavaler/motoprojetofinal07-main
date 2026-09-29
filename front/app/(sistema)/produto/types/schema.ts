// 1. Tipo igual a sua Entity Produto.java da print - espelho do Java pro TS

// 2. O que o front ENVIA para o Java criar um produto
// 3. Igualzinho aos campos da sua Entity: nome, descricao, preco, tipo, imagemUrl
export interface ProdutoRequest {
  nome: string; // 4. private String nome; - obrigatório pro create
  descricao: string; // 5. private String descricao;
  preco: number; // 6. private Double preco; -> number no TS - cuidado pra mandar número, não string
  tipo: string; // 7. private String tipo; - categoria da arma
  imagemUrl: string; // 8. private String imagemUrl; - link da imagem
}

// 9. O que o Java DEVOLVE pro front (tem o id a mais) - response vem com id gerado pelo banco
export interface ProdutoResponse {
  id: number; // 10. private Long id; -> number no TS - id auto gerado pelo JPA
  nome: string; // 11. Nome
  descricao: string; // 12. Descrição
  preco: number; // 13. Preço que vai mostrar no card
  tipo: string; // 14. Tipo
  imagemUrl: string; // 15. Url pra renderizar <img src={imagemUrl} />
}