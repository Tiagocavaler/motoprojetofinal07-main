"use client";


import { useState } from "react"; // 2. Cria memória da tela
import { useRouter } from "next/navigation"; // 3. Pra fazer router.push() sem F5
import Link from "next/link"; // 4. Link leve pra navegar
import { supabase } from "@/lib/supabaseClient"; // 5. SEU CLIENT DO SUPABASE (conexão direta com o Auth do Supabase)

export default function LoginPage() { // 6. Rota /login
  const [email, setEmail] = useState(""); // 7. Guarda email digitado
  const [senha, setSenha] = useState(""); // 8. Guarda senha digitada
  const [loading, setLoading] = useState(false); // 9. Trava botão enquanto loga
  const router = useRouter(); // 10. Instancia do roteador

  const entrar = async () => { // 11. FUNÇÃO DE LOGIN
    if (!email ||!senha) return alert("Preencha tudo"); // 12. Validação rápida front
    setLoading(true); // 13. Liga loading
    try {
      // 14. LOGIN REAL COM SUPABASE - não passa pelo Java, vai direto no Auth do Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: senha,
      });
      if (error) throw error; // 15. Se Supabase retornou erro (senha errada), joga pro catch

      // 16. Verifica se é admin pela tabela ou email (regra simples de TCC)
      if (email === "admin@palworld.com") {
        router.push("/admin"); // 17. Se é admin, manda pro painel admin
      } else {
        router.push("/catalogo"); // 18. Se é usuário comum, manda pro catálogo
      }
    } catch (err: any) {
      alert(err.message || "E-mail ou senha incorretos"); // 19. Mostra erro do Supabase
    } finally {
      setLoading(false); // 20. Desliga loading sempre
    }
  };

  return (
    // 21. JSX - Visual da página
    <div className="min-h-screen bg-[#0B1325] flex items-center justify-center p-4 text-white">
      <div className="bg-[#162342] p-8 rounded-2xl w-full max-w-sm border border-white/10">
        <Link href="/" className="text-xs text-gray-400">← Voltar</Link>
        <h1 className="text-2xl font-black text-[#E2C9A1] mt-4">Entrar</h1>
        <p className="text-[11px] text-gray-400 mt-1">Acesse sua conta</p>

        {/* 22. Inputs controlados pelos estados */}
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="E-mail" className="w-full mt-6 bg-[#0B1325] p-3 rounded-lg border border-white/10 outline-none" />
        <input value={senha} onChange={e=>setSenha(e.target.value)} type="password" placeholder="Senha" className="w-full mt-3 bg-[#0B1325] p-3 rounded-lg border border-white/10 outline-none" />

        <div className="flex justify-end mt-3">
          {/* 23. Link pra rota de esqueci - /esqueci */}
          <Link href="/esqueci" className="text-[11px] text-[#E2C9A1] hover:underline">
            Esqueceu a senha?
          </Link>
        </div>

        {/* 24. Botão chama a função entrar() */}
        <button onClick={entrar} disabled={loading} className="w-full mt-5 bg-[#E2C9A1] text-black py-3 rounded-lg font-black disabled:opacity-50">
          {loading? "ENTRANDO..." : "ENTRAR"}
        </button>
      </div>
    </div>
  );
}