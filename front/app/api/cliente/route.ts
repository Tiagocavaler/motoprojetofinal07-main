import { NextRequest, NextResponse } from 'next/server'; // 1. Tipos do Next
const JAVA_URL = process.env.JAVA_API_URL || 'http://localhost:8080'; // 2. Url do Java via .env - fallback localhost:8080 - melhor que hardcoded 127.0.0.1:8081 das outras rotas

export async function GET() { // 3. GET /api/clientes - lista clientes
  const res = await fetch(`${JAVA_URL}/api/clientes`); // 4. Chama Java
  const data = await res.json(); // 5. Pega json do Java
  return NextResponse.json(data); // 6. Devolve pro front - aqui você já usa json direto, diferente das outras que usam text (essa quebra se Java devolver HTML)
}
export async function POST(req: NextRequest) { // 7. POST /api/clientes - criar cliente
  const body = await req.json(); // 8. Body do front
  const res = await fetch(`${JAVA_URL}/api/clientes`, { // 9. Repassa pro Java
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json(); // 10. Resposta do Java
  return NextResponse.json(data, { status: res.status }); // 11. Mantém status do Java - 201 se criou
}