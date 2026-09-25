"use client";


import { useState, useEffect } from "react"; // 2. useState = memória, useEffect = roda quando abre a página
import { useRouter } from "next/navigation"; // 3. Pra fazer router.push("/")
import { supabase } from "@/lib/supabaseClient"; // 4. Cliente do Supabase

export default function AtualizarSenha(){ // 5. Rota /atualizar-senha (onde o link do email cai)
  const [novaSenha, setNovaSenha] = useState(""); // 6. Nova senha digitada - guarda o input
  const [loading, setLoading] = useState(false); // 7. Loading - trava botão pra não clicar 2x
  const router = useRouter(); // 8. Roteador pra voltar pra home

  // 9. O Supabase lê o #access_token da URL sozinho quando a página abre
  // 10. Link do email vem tipo: /atualizar-senha#access_token=...&type=recovery
  useEffect(()=> {
    supabase.auth.getSession(); // 11. Força carregar a sessão de recuperação - o supabase pega o token da URL e cria sessão temporária
  },[]); // 12. [] = roda só 1 vez quando a página abre

  const salvar = async (e:any) => { // 13. FUNÇÃO que troca a senha
    e.preventDefault(); // 14. Impede F5 do form
    if(novaSenha.length < 6) return alert("Mínimo 6 caracteres"); // 15. Validação mínima do Supabase
    setLoading(true); // 16. Liga loading
    const { error } = await supabase.auth.updateUser({ password: novaSenha }); // 17. ATUALIZA SENHA - usa a sessão de recovery que foi criada no useEffect
    setLoading(false); // 18. Desliga loading
    if(error) return alert(error.message); // 19. Se token expirou ou inválido, mostra erro
    alert("Senha trocada! Faça login."); // 20. Sucesso
    router.push("/"); // 21. Volta pra home com modal de login
  }

  return (
    // 22. JSX - Visual
    <div className="min-h-screen flex items-center justify-center bg-[#0B1325] p-4">
      <form onSubmit={salvar} className="bg-[#162342] p-8 rounded-2xl w-full max-w-sm space-y-4">
        <h1 className="text-white font-bold text-xl">Nova senha</h1>
        {/* 23. Input controlado pela novaSenha */}
        <input value={novaSenha} onChange={e=>setNovaSenha(e.target.value)} type="password" placeholder="Nova senha" className="w-full p-3 rounded-lg bg-black/30 text-white" required />
        {/* 24. Botão chama salvar() */}
        <button disabled={loading} className="w-full bg-[#E2C9A1] text-black py-3 rounded-lg font-bold">{loading?"Salvando...":"Salvar nova senha"}</button>
      </form>
    </div>
  )
}