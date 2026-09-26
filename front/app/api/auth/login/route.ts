import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = body.email?.trim().toLowerCase();
    const senha = body.senha || body.password;

    console.log("FRONT MANDOU:", email);

    // 1. ADMIN FIXO
    if (email === "admin@palworld.com" && senha === "admin123") {
      return NextResponse.json({
        id: "admin-fixo",
        nome: "Admin Palworld",
        email: "admin@palworld.com",
        role: "ADMIN",
        token: "admin-token-fixo"
      }, { status: 200 });
    }

    // 2. SUPABASE - senha nova que você acabou de cadastrar
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: senha,
    });

    if (!error && data.user) {
      return NextResponse.json({
        id: data.user.id,
        nome: data.user.user_metadata?.nome || "User",
        email: data.user.email,
        role: "USER",
      }, { status: 200 });
    }

    console.log("SUPABASE ERRO:", error?.message);
    return NextResponse.json({ message: "E-mail ou senha incorretos" }, { status: 401 });

  } catch (e: any) {
    console.error("ERRO REAL:", e);
    return NextResponse.json({ message: "ERRO: " + e.message }, { status: 500 });
  }
}