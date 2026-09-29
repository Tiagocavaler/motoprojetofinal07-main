// app/(auth)/login/types/cliente.ts
// 1. Cliente HTTP da autenticação - centraliza todas as chamadas de login/registro pro Java

import { LoginRequest, LoginResponse, RegisterRequest, ForgotRequest } from './auth'; // 2. Importa os tipos que você definiu no auth.ts

const API = '/api/auth'; // 3. Prefixo base das rotas do Next que repassam pro Java

// 4. Fetcher genérico - é isso que você vai replicar para os outros módulos
async function request<T>(url: string, data: unknown): Promise<T> {
  const res = await fetch(url, { // 5. Faz o POST pra API do Next
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data), // 6. Transforma o objeto (email/senha) em JSON
    credentials: 'include', // 7. ESSENCIAL pra persistir o cookie de auth (envia e recebe cookie)
  });

  // 8. Tenta pegar o body como JSON sempre
  const json = await res.json().catch(() => null); // 9. Se não for JSON, retorna null pra não quebrar

  if (!res.ok) { // 10. Se status não é 2xx (ex: 400, 401, 429)
    // 11. Usa a mensagem padronizada que vem do NextResponse.json({ error: ... })
    throw new Error(json?.error || `Erro na requisição: ${res.status}`); // 12. Joga erro pro catch da tela
  }

  return json as T; // 13. Se deu certo, retorna tipado (LoginResponse, etc)
}

export const authClient = {
  // 14. Objeto que exporta as 3 funções de auth - usado nas telas
  login: (data: LoginRequest): Promise<LoginResponse> => {
    return request<LoginResponse>(`${API}/login`, data); // 15. Chama POST /api/auth/login e espera token + user
  },

  register: (data: RegisterRequest) => {
    return request(`${API}/register`, data); // 16. Chama POST /api/auth/register pra criar conta
  },

  forgot: (data: ForgotRequest) => {
    // 17. troquei de /esqueci pra /forgot pra manter o padrão REST em inglês
    return request(`${API}/forgot`, data); // 18. Chama POST /api/auth/forgot (regra de 3x por dia)
  }
}