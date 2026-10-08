import { supabase } from './supabaseClient'

// ===== FIX DO ERRO DA SUA PRINT =====
export async function apiRequest<T>(url: string, options: any = {}): Promise<T> {
  const res = await fetch(url, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Erro na API');
  }
  const ct = res.headers.get('content-type');
  if (ct && ct.includes('application/json')) {
    return res.json() as Promise<T>;
  }
  return {} as T;
}
// ===== FIM DO FIX =====

export type Produto = {
  id: string
  nome: string
  tipo: string
  preco: number
  estoque: number
  ativo_na_loja?: boolean
  imagem_url?: string
}

export function padronizaNome(nome: string) {
  return nome
    .replace(/^T_/i, "")
    .replace(/^Pal_/i, "")
    .replace(/_icon/gi, "")
    .replace(/_normal/gi, "")
    .replace(/_small/gi, "")
    .replace(/_/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

export async function getProdutos() {
  const { data, error } = await supabase.from('produtos').select('*').eq('ativo_na_loja', true).order('nome')
  if (error) throw error
  return data.map((p: any) => ({
    ...p,
    nome: padronizaNome(p.nome),
    preco: Number(p.preco),
    estoque: Number(p.estoque),
    id: String(p.id)
  })) as Produto[]
}

export async function getTodosProdutosAdmin() {
  const { data, error } = await supabase.from('produtos').select('*').order('nome').range(0, 2000)
  if (error) throw error
  return data.map((p: any) => ({
    ...p,
    nome: padronizaNome(p.nome),
    preco: Number(p.preco),
    estoque: Number(p.estoque),
    id: String(p.id)
  })) as Produto[]
}

export async function getCarrinho() {
  const { data, error } = await supabase.from('carrinho').select('*, produtos(*)').order('created_at', { ascending: false })
  if (error) throw error
  return data.map((item: any) => ({
    ...item,
    produtos: item.produtos ? {
      ...item.produtos,
      nome: padronizaNome(item.produtos.nome),
      preco: Number(item.produtos.preco),
      estoque: Number(item.produtos.estoque)
    } : null
  }))
}

export async function addCarrinho(produto_id: string | number) {
  const id = String(produto_id).trim()
  if (!id || id === "NaN") throw new Error(`ID inválido: ${produto_id}`)
  const { data: prod, error: errProd } = await supabase.from('produtos').select('estoque').eq('id', id).single()
  if (errProd) throw errProd
  const estoqueReal = Number(prod?.estoque ?? 0)
  if (estoqueReal <= 0) throw new Error('Sem estoque!')
  const { data: existente } = await supabase.from('carrinho').select('*').eq('produto_id', id).maybeSingle()
  if (existente) {
    const { error } = await supabase.from('carrinho').update({ quantidade: existente.quantidade + 1 }).eq('id', existente.id)
    if (error) throw error
  } else {
    const { error } = await supabase.from('carrinho').insert([{ produto_id: id, quantidade: 1 }])
    if (error) throw error
  }
  const { error: erroEstoque } = await supabase.from('produtos').update({ estoque: estoqueReal - 1 }).eq('id', id)
  if (erroEstoque) throw erroEstoque
  return true
}

export async function updateQuantidadeCarrinho(id: string, quantidade: number) {
  if (quantidade <= 0) return removerCarrinho(id)
  const { data: item } = await supabase.from('carrinho').select('*, produtos(*)').eq('id', id).single()
  if (!item) throw new Error("Item não encontrado")
  const diferenca = quantidade - item.quantidade
  const estoqueAtual = Number(item.produtos?.estoque ?? 0)
  if (diferenca > 0 && estoqueAtual < diferenca) throw new Error(`Só tem ${estoqueAtual} no estoque!`)
  const { data, error } = await supabase.from('carrinho').update({ quantidade }).eq('id', id).select()
  if (error) throw error
  await supabase.from('produtos').update({ estoque: estoqueAtual - diferenca }).eq('id', item.produto_id)
  return data
}

export async function removerCarrinho(id: string) {
  const { data: item } = await supabase.from('carrinho').select('*, produtos(*)').eq('id', id).single()
  if (item) {
    const estoqueAtual = Number(item.produtos?.estoque ?? 0)
    await supabase.from('produtos').update({ estoque: estoqueAtual + item.quantidade }).eq('id', item.produto_id)
  }
  const { error } = await supabase.from('carrinho').delete().eq('id', id)
  if (error) throw error
}

export async function limparCarrinho() {
  const { error } = await supabase.from('carrinho').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  if (error) throw error
}

export async function criarPedido(total: number, itens: any[]) {
  const itensFormatados = itens.map((i: any) => ({
    produtoId: String(i.produto_id || i.produtos?.id),
    nome: i.produtos?.nome || 'Produto',
    preco: Number(i.produtos?.preco || 0),
    quantidade: Number(i.quantidade)
  }))

  try {
    const res = await fetch('http://localhost:8081/pedidos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ clienteId: 1, itens: itensFormatados })
    })
    if (!res.ok) throw new Error('Java erro: ' + await res.text())
    const pedidoJava = await res.json()
    await limparCarrinho()
    return { id: pedidoJava.id || pedidoJava.pedidoId, ...pedidoJava, total }
  } catch (e) {
    console.warn("Java offline, salvando no Supabase:", e)
    const { data, error } = await supabase
      .from('pedidos')
      .insert([{ 
        total: total, 
        status: 'pendente',
        itens: itensFormatados
      }])
      .select()
      .single()
    if (error) throw error
    await limparCarrinho()
    return data
  }
}

export async function confirmarPagamentoPix(pedidoId: string) {
  const { data, error } = await supabase.from('pedidos').update({ status: 'pago' }).eq('id', pedidoId).select().single()
  if (error) throw error
  return data
}

export async function getMeusPedidos() {
  const { data, error } = await supabase.from('pedidos').select('*').order('id', { ascending: false })
  if (error) throw error
  return data.map((p: any) => ({ ...p, total: Number(p.total || 0) }))
}

export async function padronizarTodosNomes() {
  const { data } = await supabase.from('produtos').select('id, nome');
  if (!data) return 0;
  let atualizados = 0;
  for (const p of data) {
    const novoNome = padronizaNome(p.nome);
    if (novoNome !== p.nome) {
      await supabase.from('produtos').update({ nome: novoNome }).eq('id', p.id);
      atualizados++;
    }
  }
  return atualizados;
}