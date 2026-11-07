// Gerencia tudo offline
export const OFFLINE_KEYS = {
  PRODUTOS: "cache_produtos",
  CARRINHO: "carrinho_offline",
  PEDIDOS_PENDENTES: "pedidos_pendentes_sync"
}

// Salva carrinho sempre local
export function salvarCarrinho(carrinho: any[]) {
  localStorage.setItem(OFFLINE_KEYS.CARRINHO, JSON.stringify(carrinho))
}

export function carregarCarrinho() {
  return JSON.parse(localStorage.getItem(OFFLINE_KEYS.CARRINHO) || "[]")
}

// Quando volta a conexão, sincroniza
export async function tentarSyncSupabase(supabase: any) {
  if (!navigator.onLine) return;
  
  const pendentes = JSON.parse(localStorage.getItem(OFFLINE_KEYS.PEDIDOS_PENDENTES) || "[]")
  if (pendentes.length > 0) {
    try {
      for (const pedido of pendentes) {
        await supabase.from("pedidos").insert(pedido)
      }
      localStorage.removeItem(OFFLINE_KEYS.PEDIDOS_PENDENTES)
      console.log("Sync offline -> online OK")
    } catch (e) {
      console.log("Ainda offline, mantendo na fila")
    }
  }
}