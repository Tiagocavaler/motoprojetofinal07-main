"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import { useRouter } from "next/navigation";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export default function PerfilPage() {
  const [user, setUser] = useState<any>(null); // 1. Usuário logado Supabase
  const [produtos, setProdutos] = useState<any[]>([]); // 2. Produtos para usar como avatar
  const [avatar, setAvatar] = useState<string | null>(null); // 3. Avatar escolhido
  const [pedidos, setPedidos] = useState<any[]>([]); // 4. Histórico de pedidos
  const [aba, setAba] = useState<"pedidos" | "dados">("pedidos"); // 5. Controle de abas
  const [novoEmail, setNovoEmail] = useState(""); // 6. Edição email
  const [novaSenha, setNovaSenha] = useState(""); // 7. Edição senha
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // 8. Carrega tudo ao abrir
  useEffect(() => {
    const carregarPerfil = async () => {
      // 9. Pega usuário logado
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }
      setUser(user);
      setNovoEmail(user.email || "");

      // 10. Pega produtos para usar imagem como avatar estilizado
      const { data: prods } = await supabase.from("produtos").select("imagem, nome").limit(12);
      if (prods) setProdutos(prods);

      // 11. Avatar salvo no navegador (fallback)
      const avatarSalvo = localStorage.getItem(`avatar_${user.id}`);
      if (avatarSalvo) {
        setAvatar(avatarSalvo);
      } else if (prods && prods.length > 0) {
        setAvatar(prods[0].imagem); // 12. Primeiro produto como avatar inicial
      }

      // 13. Pedidos do localStorage (seu sistema de fallback da banca)
      const meusPedidos = JSON.parse(localStorage.getItem("meus_pedidos") || "[]");

      // 14. Pedidos do Supabase também
      const { data: pedidosSupabase } = await supabase.from("pedidos").select("*").order("created_at", { ascending: false });

      // 15. Junta os dois
      const todosPedidos = [...meusPedidos,...(pedidosSupabase || [])];
      setPedidos(todosPedidos);

      setLoading(false);
    };
    carregarPerfil();
  }, []);

  // 16. Trocar avatar - puxado dos PNGs dos produtos
  const escolherAvatar = (imgUrl: string) => {
    setAvatar(imgUrl);
    if (user) {
      localStorage.setItem(`avatar_${user.id}`, imgUrl); // 17. Salva por usuário
    }
  };

  // 18. Atualizar email e senha
  const salvarDados = async () => {
    if (!novoEmail) return alert("Digite um e-mail");

    // 19. Atualiza email no Supabase Auth
    if (novoEmail!== user.email) {
      const { error: emailError } = await supabase.auth.updateUser({ email: novoEmail });
      if (emailError) return alert("Erro ao atualizar email: " + emailError.message);
    }

    // 20. Atualiza senha se digitou
    if (novaSenha) {
      if (novaSenha.length < 6) return alert("Senha precisa ter 6+ caracteres");
      const { error: senhaError } = await supabase.auth.updateUser({ password: novaSenha });
      if (senhaError) return alert("Erro ao atualizar senha: " + senhaError.message);
    }

    alert("Dados atualizados com sucesso! Se trocou o e-mail, confirme no novo e-mail.");
    setNovaSenha("");
  };

  // 21. Formata status com cor
  const getStatusColor = (status: string) => {
    if (status === "pago" || status === "aprovado") return "bg-green-500";
    if (status === "pendente") return "bg-yellow-500";
    if (status === "cancelado") return "bg-red-500";
    return "bg-gray-500";
  };

  if (loading) return <div className="min-h-screen bg-[#0B1325] flex items-center justify-center text-white">Carregando perfil...</div>;

  return (
    <div className="min-h-screen bg-[#0B1325] p-6 md:p-8 text-white">
      {/* 22. Header do perfil */}
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row items-center gap-6 bg-[#121E36] p-6 rounded-2xl border border-[#1F2E4F]">
          {/* 23. Avatar estilizado vindo dos produtos */}
          <div className="relative">
            <img src={avatar || "/placeholder.png"} alt="avatar" className="w-24 h-24 rounded-full object-cover border-4 border-[#E2C9A1] bg-white" />
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-[#121E36]"></div>
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-2xl font-black text-[#E2C9A1]">{user?.email?.split("@")[0] || "Usuário"}</h1>
            <p className="text-gray-400 text-sm">{user?.email}</p>
            <p className="text-xs text-gray-500 mt-1">Membro desde {new Date(user?.created_at).toLocaleDateString("pt-BR")}</p>
          </div>
          <Link href="/" className="md:ml-auto bg-[#E2C9A1] text-black px-6 py-2 rounded-xl font-bold text-sm">Voltar ao catálogo</Link>
        </div>

        {/* 24. Escolha de avatar com PNG dos produtos */}
        <div className="mt-6 bg-[#121E36] p-4 rounded-2xl border border-[#1F2E4F]">
          <h3 className="font-bold text-[#E2C9A1] mb-3 text-sm">Escolha seu avatar estilizado (produtos da loja)</h3>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {produtos.map((p, idx) => (
              <button key={idx} onClick={() => escolherAvatar(p.imagem)} className={`min-w-[64px] w-16 h-16 rounded-full overflow-hidden border-2 bg-white ${avatar === p.imagem? "border-[#E2C9A1] scale-110" : "border-transparent opacity-70"}`}>
                <img src={p.imagem} alt={p.nome} className="w-full h-full object-contain p-1" />
              </button>
            ))}
          </div>
        </div>

        {/* 25. Abas */}
        <div className="mt-8 flex gap-2">
          <button onClick={() => setAba("pedidos")} className={`px-6 py-3 rounded-xl font-black text-sm ${aba === "pedidos"? "bg-[#E2C9A1] text-black" : "bg-[#121E36] text-white border border-[#1F2E4F]"}`}>Meus Pedidos ({pedidos.length})</button>
          <button onClick={() => setAba("dados")} className={`px-6 py-3 rounded-xl font-black text-sm ${aba === "dados"? "bg-[#E2C9A1] text-black" : "bg-[#121E36] text-white border border-[#1F2E4F]"}`}>Dados Pessoais</button>
        </div>

        {/* 26. Aba de pedidos - status ao vivo */}
        {aba === "pedidos" && (
          <div className="mt-6 grid gap-4">
            {pedidos.length === 0? (
              <div className="bg-[#121E36] p-8 rounded-2xl text-center border border-[#1F2E4F]">
                <p className="text-gray-400">Você ainda não tem pedidos</p>
                <Link href="/catalogo" className="inline-block mt-4 bg-[#E2C9A1] text-black px-6 py-2 rounded-xl font-bold">Ver Catálogo</Link>
              </div>
            ) : (
              pedidos.map((pedido, i) => (
                <div key={i} className="bg-[#121E36] p-5 rounded-2xl border border-[#1F2E4F] flex flex-col md:flex-row justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <p className="font-black text-white">Pedido #{pedido.id?.substring(0, 8).toUpperCase() || i + 1}</p>
                      <span className={`text-[10px] px-2 py-1 rounded-full text-white font-bold ${getStatusColor(pedido.status)}`}>{pedido.status?.toUpperCase() || "PAGO"}</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">{new Date(pedido.created_at).toLocaleString("pt-BR")}</p>
                    <p className="text-sm text-gray-300 mt-2">{pedido.itens?.length || 1} itens - Total: <b className="text-[#E2C9A1]">R$ {Number(pedido.total).toFixed(2)}</b></p>
                  </div>
                  <div className="flex items-center">
                    <div className="text-right">
                      <p className="text-xs text-gray-500">Acompanhe em tempo real</p>
                      <div className="flex items-center gap-1 mt-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <p className="text-xs text-green-400">Atualizado agora</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* 27. Aba de dados pessoais - edição */}
        {aba === "dados" && (
          <div className="mt-6 bg-[#121E36] p-6 rounded-2xl border border-[#1F2E4F] max-w-2xl">
            <h2 className="font-black text-[#E2C9A1] text-lg mb-6">Meus Dados</h2>

            <div className="space-y-4">
              <div>
                <label className="text-xs text-gray-400">E-mail de cadastro</label>
                <input value={novoEmail} onChange={(e) => setNovoEmail(e.target.value)} className="w-full mt-1 bg-[#0B1325] border border-[#1F2E4F] rounded-xl px-4 py-3 text-white text-sm" placeholder="seu@email.com" />
              </div>

              <div>
                <label className="text-xs text-gray-400">Nova senha (deixe em branco para não alterar)</label>
                <input type="password" value={novaSenha} onChange={(e) => setNovaSenha(e.target.value)} className="w-full mt-1 bg-[#0B1325] border border-[#1F2E4F] rounded-xl px-4 py-3 text-white text-sm" placeholder="••••••••" />
              </div>

              <div className="pt-2">
                <p className="text-[11px] text-gray-500">ID: {user?.id}</p>
                <p className="text-[11px] text-gray-500">Último login: {user?.last_sign_in_at? new Date(user.last_sign_in_at).toLocaleString("pt-BR") : "agora"}</p>
              </div>

              <button onClick={salvarDados} className="w-full bg-[#E2C9A1] text-black py-4 rounded-xl font-black mt-4">Salvar Alterações</button>

              <button onClick={async () => { await supabase.auth.signOut(); router.push("/login"); }} className="w-full bg-red-500/10 text-red-400 border border-red-500/20 py-3 rounded-xl font-bold text-sm mt-2">Sair da conta</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}