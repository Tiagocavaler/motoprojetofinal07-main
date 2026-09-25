import { apiRequest } from '@/lib/api'; // 1. Função que faz o fetch para o backend - centraliza headers, credentials, erro
import { ClienteRequest, ClienteResponse } from './schema'; // 2. Tipos do cliente - request é o que manda, response é o que volta do Java

const API = '/api/clientes'; // 3. Rota do Next que chama o Java - /api/clientes -> seu backend Java /clientes

// 4. Cliente HTTP - todas as chamadas da tela de cliente - padrão que você vai replicar pros outros módulos
export const clienteClient = {
  list: (): Promise<ClienteResponse[]> => apiRequest(API), // 5. Busca todos os clientes - GET /api/clientes
  create: (data: ClienteRequest) => apiRequest(API, { method: 'POST', body: data }), // 6. Cria novo cliente - POST /api/clientes com body { nome, email, etc }
  remove: (id: number) => apiRequest(`${API}/${id}`, { method: 'DELETE' }), // 7. Deleta cliente - DELETE /api/clientes/{id}
}