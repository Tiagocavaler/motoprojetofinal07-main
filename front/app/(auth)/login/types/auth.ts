// app/(auth)/login/types/auth.ts - VERSÃO LIMPA
// 1. Arquivo só de TIPOS - não executa nada, só define o formato dos dados que vão entre Front e Java

export interface LoginRequest {
  // 2. O que o front MANDA pro Java quando loga
  email: string;
  password: string;
}

export interface LoginResponse {
  // 3. O que o Java DEVOLVE quando o login dá certo
  token: string; // 4. JWT que o Java gera (vai pro localStorage)
  user: { id: string; name: string; email: string }; // 5. Dados do usuário logado
}

export interface RegisterRequest {
  // 6. O que o front MANDA pro Java pra criar conta
  name: string;
  email: string;
  password: string;
}

export interface ForgotRequest {
  // 7. O que o front MANDA pra pedir recuperação de senha
  email: string; // 8. Só precisa do email
}

// FALTAVA ESSE - é o que sua tela de Nova Senha precisa
export interface ResetPasswordRequest {
  // 9. O que o front MANDA quando vai trocar a senha com o link
  token: string; // 10. Token que veio por email (vem na URL ?token=...)
  novaSenha: string; // 11. Nova senha digitada
}

// Opcional mas recomendado pelo professor: resposta padrão
export interface ApiError {
  // 12. Formato padrão quando o Java retorna erro (400, 429, 401...)
  error: string; // 13. Ex: "Limite de 3x atingido", "Token expirado"
}