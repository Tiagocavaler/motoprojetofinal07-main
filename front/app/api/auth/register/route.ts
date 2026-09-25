import { NextResponse } from "next/server"; // 1. Resposta

export const dynamic = "force-dynamic"; // 2. Sempre dinâmica - sem cache

export async function POST(req: Request) { // 3. POST /api/register - ponte pra Java
  try {
    const body = await req.json(); // 4. { nome, email, senha } que veio do front
    const res = await fetch(`http://127.0.0.1:8081/auth/register`, { // 5. Repassa pro Spring - /auth/register do seu Java - igual o de login mas pra cadastro
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body), // 6. Repassa igual
      cache: "no-store", // 7. Sem cache
    });
    const text = await res.text(); // 8. Pega como text - evita quebrar se Java devolver erro não-json
    return new NextResponse(text, { // 9. Devolve cru
      status: res.status, // 10. Mantém 200, 400, 409 (email já existe) etc
      headers: { "Content-Type": "application/json" }
    });
  } catch (e: any) { // 11. Java off ou erro de rede
    return NextResponse.json({ message: "ERRO REAL: " + e.message }, { status: 500 }); // 12. ECONNREFUSED = Java não tá rodando na 8081
  }
}