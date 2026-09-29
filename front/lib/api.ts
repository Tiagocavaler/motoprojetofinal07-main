import { supabase } from './supabaseClient'

// ===== PRODUTOS - SÓ O QUE ADMIN LIBEROU (LOJA) =====
export async function getProdutos() { // 1. Loja - só ativo e com estoque
  const { data, error } = await supabase
  .from('produtos')
  .select('*')
  .eq('ativo_na_loja', true) // 2. flag que admin liga
  .gt('estoque', 0) // 3. >0
  .order('nome')
  if (error) throw error
  return data
}

// ===== ADMIN - VER TUDO MESMO DESATIVADO =====
export async function getTodosProdutosAdmin() { // 4. Admin vê tudo - ativo ou não, sem estoque
  const { data, error } = await supabase
  .from('produtos')
  .select('*')
  .order('nome')
  .range(0, 2000) // 5. limite 2001 linhas - paginação manual
  if (error) throw error
  return data
}

// ===== CARRINHO =====
export async function getCarrinho() { // 6. Pega carrinho + join produtos
  const { data, error } = await supabase
  .from('carrinho')
  .select('*, produtos(*)') // 7. produtos(*) = inner join
  .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function addCarrinho(produto_id: string) { // 8. Add ou incrementa
  const { data: existente } = await supabase
  .from('carrinho')
  .select('*')
  .eq('produto_id', produto_id)
  .maybeSingle() // 9. 0 ou 1 - não erro se não achar

  if (existente) { // 10. Já tem -> +1
    const { data, error } = await supabase
    .from('carrinho')
    .update({ quantidade: existente.quantidade + 1 })
    .eq('id', existente.id)
    .select()
    if (error) throw error
    return data
  } else { // 11. Novo -> insert 1
    const { data, error } = await supabase
    .from('carrinho')
    .insert([{ produto_id, quantidade: 1 }])
    .select()
    if (error) throw error
    return data
  }
}

export async function updateQuantidadeCarrinho(id: string, quantidade: number) { // 12. +- quantidade
  if (quantidade <= 0) { // 13. Se 0 ou menos remove
    return removerCarrinho(id)
  }
  const { data, error } = await supabase
  .from('carrinho')
  .update({ quantidade })
  .eq('id', id)
  .select()
  if (error) throw error
  return data
}

export async function removerCarrinho(id: string) { // 14. Remove item
  const { error } = await supabase.from('carrinho').delete().eq('id', id)
  if (error) throw error
}

export async function limparCarrinho() { // 15. Limpa tudo
  // 16. CORRIGIDO: jeito certo de limpar tudo - delete sem where não deixa no supabase, tem que por neq id impossível
  const { error } = await supabase
  .from('carrinho')
  .delete()
  .neq('id', '00000000-0000-0000-0000-000000000000') // 17. truque - apaga tudo exceto uuid que não existe = apaga tudo
  if (error) throw error
}

// ===== PEDIDOS =====
export async function criarPedido(total: number, itens: any[]) { // 18. Cria pedido pendente
  const { data, error } = await supabase
  .from('pedidos')
  .insert([{ total, itens, status: 'pendente' }]) // 19. itens = json com snapshot do carrinho
  .select()
  if (error) throw error
  return data[0]
}

export async function confirmarPagamentoPix(pedidoId: string) { // 20. Após pagar - marca pago - TODO: deveria ser webhook, não front
  const { data, error } = await supabase
  .from('pedidos')
  .update({ status: 'pago' })
  .eq('id', pedidoId)
  .select()
  if (error) throw error
  return data
}

export async function getMeusPedidos() { // 21. Histórico - sem filtro user_id ainda
  const { data, error } = await supabase
  .from('pedidos')
  .select('*')
  .order('created_at', { ascending: false })
  if (error) throw error
  return data
}