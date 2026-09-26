export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: Request){
  try {
    const { email } = await req.json();
    
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
      redirectTo: "http://localhost:3000/atualizar-senha",
    });

    if(error) {
      console.log("SUPABASE FORGOT ERRO:", error.message);
      // Retorna OK mesmo com erro pra não dar dica pra hacker
      return NextResponse.json({ message: "Se o e-mail existir, enviamos o link" });
    }

    return NextResponse.json({ message: "Enviado" });
  } catch (e: any) {
    return NextResponse.json({ message: "Enviado" });
  }
}