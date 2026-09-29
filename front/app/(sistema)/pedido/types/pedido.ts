import { apiRequest } from '@/lib/api'; // 1. Função fetch central - já trata erro, headers
import { PedidoRequest, PedidoResponse } from './schema'; // 2. Request = o que envia pro Java, Response = o que volta

const API = '/api/pedidos'; // 3. Rota do Next que repassa pro Java - seu proxy

export const pedidoClient = {
  // 4. GET /api/pedidos -> busca todos - lista pro admin e pro cliente ver
  list: (): Promise<PedidoResponse[]> => apiRequest(API),
  
  // 5. POST /api/pedidos -> cria com cliente_id + lista de produto_id - cria pedido real, não simulado
  create: (data: PedidoRequest) => apiRequest<PedidoResponse>(API, { method: 'POST', body: data }),
  
  // 6. DELETE /api/pedidos/{id} - deleta pedido se precisar cancelar
  remove: (id: number) => apiRequest(`${API}/${id}`, { method: 'DELETE' }),
}