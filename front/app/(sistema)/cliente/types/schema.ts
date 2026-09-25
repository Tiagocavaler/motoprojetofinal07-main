// 1. Tipo do status que vem do Java (ATIVO, INATIVO, BLOQUEADO) - tem que ser igual ao Enum do Java pra não quebrar
export enum EnumStatusCliente {
  ATIVO = "ATIVO", // 2. Cliente pode comprar normal
  INATIVO = "INATIVO", // 3. Cliente desativado, não loga
  BLOQUEADO = "BLOQUEADO" // 4. Cliente bloqueado por fraude / dívida
}

// 5. O que o front ENVIA para o Java quando cria um cliente - DTO de entrada
export interface ClienteRequest {
  nome: string; // 6. Nome completo
  cpf: string; // 7. CPF sem máscara ou com máscara, depende do seu Java validar
  senha: string; // 8. Senha pura, Java faz hash no backend
  email: string; // 9. Email único
  status: EnumStatusCliente; // 10. Status inicial, geralmente ATIVO
}

// 11. O que o Java DEVOLVE para o front quando lista - DTO de saída (não volta senha por segurança)
export interface ClienteResponse {
  id: number; // 12. ID gerado pelo banco Java
  nome: string; // 13. Nome que foi salvo
  cpf: string; // 14. CPF que foi salvo
  email: string; // 15. Email que foi salvo
  status: EnumStatusCliente; // 16. Status atual do banco
}