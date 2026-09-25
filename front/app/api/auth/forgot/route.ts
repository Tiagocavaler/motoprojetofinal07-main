export const dynamic = "force-dynamic"; // 1. Rota sempre dinâmica - não deixa o Next fazer cache dessa rota
import { NextResponse } from "next/server"; // 2. Resposta do Next - pra dar json com status
import { supabase } from "@/lib/supabaseClient"; // 3. Seu client normal (anon key)
import { createClient } from "@supabase/supabase-js"; // 4. Client admin pra contar - precisa service_role

// 5. Client com service_role pra poder ler a tabela de limites (cola sua SERVICE_KEY no .env) - anon não consegue ler password_reset_limits por causa do RLS
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // 6. Pega em Settings > API Keys > service_role - só no servidor, nunca no front
);

export async function POST(req: Request){ // 7. POST /api/recuperar-senha
  try{
    const { email } = await req.json(); // 8. Pega email do front - body: { email: "fulano@gmail.com" }
    if(!email) return NextResponse.json({ error: "Email obrigatório" }, { status: 400 }); // 9. Validação

    // 10. Pega começo do dia de hoje (00:00) - pra zerar contagem todo dia
    const hoje = new Date();
    hoje.setHours(0,0,0,0); // 11. Ex: 2026-05-13T00:00:00

    // 12. Conta quantos pedidos esse email fez hoje - anti spam
    const { data: tentativas, error } = await supabaseAdmin
      .from("password_reset_limits") // 13. Sua tabela que guarda cada tentativa de reset
      .select("id")
      .eq("email", email) // 14. Filtra por esse email
      .gte("created_at", hoje.toISOString()); // 15. created_at >= hoje 00:00

    if(error) throw error; // 16. Se erro no select

    // 17. REGRA 1: Máximo 3 por dia - trava brute force
    if(tentativas && tentativas.length >= 3){
      return NextResponse.json({ error: "Limite de 3 recuperações por dia atingido. Tente amanhã." }, { status: 429 }); // 18. 429 Too Many Requests
    }

    // 19. REGRA 2 e 3: Manda o e-mail real do Supabase - se passou no limite
    const { error: errSupabase } = await supabase.auth.resetPasswordForEmail(email, { // 20. Supabase manda o link de reset
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/atualizar-senha`, // 21. Pra onde o link leva - sua página que tem updateUser
    });
    if(errSupabase) throw errSupabase; // 22. Se email não existe, etc

    // 23. Salva essa tentativa na nossa tabela - conta pro limite de amanhã
    await supabaseAdmin.from("password_reset_limits").insert({ email, used: false });

    return NextResponse.json({ message: "E-mail enviado" }); // 24. Sucesso
  }catch(e:any){
    return NextResponse.json({ error: e.message }, { status: 500 }); // 25. Erro genérico
  }
}