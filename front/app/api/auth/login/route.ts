import { NextResponse } from "next/server"; // 1. Resposta do Next

export const dynamic = "force-dynamic"; // 2. Nunca cacheia - toda request vai pro Java

export async function POST(req: Request) { // 3. POST /api/login - ponte Next -> Java
  try {
    const body = await req.json(); // 4. O que o front mandou - { email, senha } etc
    console.log("FRONT MANDOU:", body); // 5. Log pra debug no terminal do Next

    const res = await fetch(`http://127.0.0.1:8081/auth/login`, { // 6. Chama seu Java - Spring Boot rodando na 8081 - atenção: em prod isso tem que virar process.env.JAVA_URL
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body), // 7. Repassa body igual
      cache: "no-store", // 8. Sem cache
    });

    const text = await res.text(); // 9. Pega como text primeiro - porque se o Java devolver erro HTML, json() quebra
    console.log("JAVA RESPONDEU:", res.status, text); // 10. Log do que o Java respondeu - essencial pra ver 401, 500 etc

    // 11. devolve exatamente o que o Java respondeu - ponte transparente
    return new NextResponse(text, { // 12. Devolve o texto cru do Java pro front
      status: res.status, // 13. Mantém status do Java - 200, 401, etc
      headers: { "Content-Type": "application/json" } // 14. Força json
    });

  } catch (e: any) { // 15. Se nem conseguiu conectar no Java - Java desligado
    console.error("ERRO REAL DA PONTE:", e); // 16. Log do erro real - ECONNREFUSED etc
    return NextResponse.json({ message: "ERRO REAL: " + e.message }, { status: 500 }); // 17. Devolve pro front que a ponte quebrou
  }
}