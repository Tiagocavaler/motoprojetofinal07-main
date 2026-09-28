import { supabase } from './supabaseClient'

// ===== PRODUTOS - LOJA =====
export async function getProdutos() {
  const { data, error } = await supabase
 .from('produtos')
 .select('*')
 .eq('ativo_na_loja', true)
 .gt('estoque', 0)
 .order('nome')
  if (error) throw error
  return data
}

export async function getTodosProdutosAdmin() {
  const { data, error } = await supabase
 .from('produtos')
 .select('*')
 .order('nome')
 .range(0, 2000)
  if (error) throw error
  return data
}

// ===== CARRINHO =====
export async function getCarrinho() {
  const { data, error } = await supabase
 .from('carrinho')
 .select('*, produtos(*)')
 .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function addCarrinho(produto_id: string) {
  const { data: existente } = await supabase.from('carrinho').select('*').eq('produto_id', produto_id).maybeSingle()
  if (existente) {
    const { data, error } = await supabase.from('carrinho').update({ quantidade: existente.quantidade + 1 }).eq('id', existente.id).select()
    if (error) throw error
    return data
  } else {
    const { data, error } = await supabase.from('carrinho').insert([{ produto_id, quantidade: 1 }]).select()
    if (error) throw error
    return data
  }
}

export async function updateQuantidadeCarrinho(id: string, quantidade: number) {
  if (quantidade <= 0) return removerCarrinho(id)
  const { data, error } = await supabase.from('carrinho').update({ quantidade }).eq('id', id).select()
  if (error) throw error
  return data
}

export async function removerCarrinho(id: string) {
  const { error } = await supabase.from('carrinho').delete().eq('id', id)
  if (error) throw error
}

export async function limparCarrinho() {
  const { error } = await supabase.from('carrinho').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  if (error) throw error
}

// ===== PEDIDOS =====
export async function criarPedido(total: number, itens: any[]) {
  const { data, error } = await supabase.from('pedidos').insert([{ total, itens, status: 'pendente' }]).select()
  if (error) throw error
  return data[0]
}

export async function confirmarPagamentoPix(pedidoId: string) {
  const { data, error } = await supabase.from('pedidos').update({ status: 'pago' }).eq('id', pedidoId).select()
  if (error) throw error
  return data
}

export async function getMeusPedidos() {
  const { data, error } = await supabase.from('pedidos').select('*').order('created_at', { ascending: false })
  if (error) throw error
  return data
}

// ===== FIX QUE FALTAVA - CLIENTES E PEDIDOS (JAVA) =====
export async function apiRequest<T = any>(endpoint: string, options: any = {}): Promise<T> {
  const { body, headers,...rest } = options;
  const res = await fetch(endpoint, {
    method: rest.method || 'GET',
    headers: { 'Content-Type': 'application/json',...headers },
    body: body? JSON.stringify(body) : undefined,
   ...rest,
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(errText || `Erro ${res.status}`);
  }
  if (res.status === 204) return null as T;
  const text = await res.text();
  return (text? JSON.parse(text) : null) as T;
}