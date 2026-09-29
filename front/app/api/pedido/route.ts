import { NextRequest, NextResponse } from 'next/server'; // 1. Tipos

const JAVA_URL = process.env.JAVA_API_URL || 'http://localhost:8080'; // 2. URL Java

export async function GET() { // 3. GET /api/pedidos - lista
  const res = await fetch(`${JAVA_URL}/api/pedidos`, { cache: 'no-store' }); // 4. no-store - não cachear pedido, sempre fresco
  const data = await res.json(); // 5. json do Java
  return NextResponse.json(data); // 6. pro front
}

export async function POST(req: NextRequest) { // 7. POST /api/pedidos - criar pedido
  const body = await req.json(); // 8. body do front - { clienteId, produtosIds, status } - formato simples pro front

  const javaBody = { // 9. Converte pro formato que JPA espera - aqui é o pulo do gato
    status: body.status, // 10. "PENDENTE" ou "ENTREGUE"
    cliente: { id: body.clienteId }, // 11. Java espera objeto cliente { id } não clienteId cru - ManyToOne
    produtos: body.produtosIds.map((id: number) => ({ id })), // 12. Lista de ids vira lista de objetos [{id:1},{id:2}] - ManyToMany
  };

  const res = await fetch(`${JAVA_URL}/api/pedidos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(javaBody), // 13. Manda convertido
  });

  const data = await res.json(); // 14. resposta Java
  return NextResponse.json(data, { status: res.status }); // 15. mantém status
}