"use client";


import { useEffect, useState } from "react"; // 2. useState guarda chave/nome, useEffect carrega quando abre
import { supabase } from "@/lib/supabaseClient"; // 3. Cliente Supabase

export default function ConfigLoja() { // 4. Rota /admin/config - onde o DONO configura PIX dele
  const [chave, setChave] = useState(""); // 5. Chave PIX do cliente (CPF/CNPJ/aleatória) - onde o dinheiro vai cair
  const [nome, setNome] = useState(""); // 6. Nome que aparece no banco (ex: JOAO DA SILVA)

  useEffect(() => { // 7. Quando abre a página, busca config atual
    supabase.from("loja_config").select("*").single().then(({data}) => { // 8. Pega a única linha da tabela loja_config
      if(data) { setChave(data.pix_chave); setNome(data.pix_nome); } // 9. Se já tem salvo, preenche inputs
    });
  }, []);

  const salvar = async () => { // 10. SALVA CHAVE DO CLIENTE
    await supabase.from("loja_config").update({ pix_chave: chave, pix_nome: nome }).neq("id", "00000000-0000-0000-0000-000000000000"); // 11. UPDATE na tabela loja_config - o .neq(id, 000...) é truque pra atualizar a única linha sem saber o ID (padrão Supabase pra tabela de 1 linha só)
    alert("Chave do cliente salva!"); // 12. Feedback
  };

  return (
    // 13. JSX - Painel simples de config
    <div className="p-8 bg-[#0B1325] min-h-screen text-white">
      <h1 className="text-2xl font-black text-[#E2C9A1]">Configuração PIX do Cliente</h1>
      <div className="mt-6 max-w-md bg-[#162342] p-6 rounded-2xl border border-white/10">
        <label className="text-xs text-zinc-400">Chave PIX do cliente (CPF, CNPJ, aleatória)</label>
        <input value={chave} onChange={e => setChave(e.target.value)} className="w-full mt-2 p-3 rounded-xl bg-black/30 border border-white/10" placeholder="chave pix do cliente" />
        
        <label className="text-xs text-zinc-400 mt-4 block">Nome que aparece no banco</label>
        <input value={nome} onChange={e => setNome(e.target.value)} className="w-full mt-2 p-3 rounded-xl bg-black/30 border border-white/10" />

        <button onClick={salvar} className="w-full mt-6 bg-[#E2C9A1] text-black py-3 rounded-xl font-black">SALVAR CHAVE</button>
      </div>
    </div>
  );
}