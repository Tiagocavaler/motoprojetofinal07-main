"use client";

import { useEffect, useState } from "react"; // 2. Hooks
import { supabase } from "@/lib/supabaseClient"; // 3. Cliente supabase já pronto

export default function PerfilPage() { // 4. Página /perfil
  const [user, setUser] = useState<any>(null); // 5. Usuário do auth (email, id)
  const [profile, setProfile] = useState<any>(null); // 6. Profile da tabela profiles (apelido, avatar_url)
  const [pedidos, setPedidos] = useState<any[]>([]); // 7. Histórico de pedidos desse user
  const [avatares, setAvatares] = useState<any[]>([]); // 8. Lista de avatares da loja - tabela avatares_loja
  const [showAvatares, setShowAvatares] = useState(false); // 9. Mostra/esconde grade de avatares

  useEffect(() => { // 10. Carrega tudo ao abrir
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser(); // 11. Pega user logado - se não tiver, user = null
      setUser(user);
      if (!user) return; // 12. Se não logou, para aqui

      const { data: prof } = await supabase.from("profiles").select("*").eq("id", user.id).single(); // 13. Busca perfil - SELECT * FROM profiles WHERE id = user.id
      setProfile(prof);

      const { data: peds } = await supabase.from("pedidos").select("*").eq("user_id", user.id).order("created_at", { ascending: false }); // 14. Busca pedidos só desse user - histórico
      setPedidos(peds || []);

      const { data: avs } = await supabase.from("avatares_loja").select("*"); // 15. Busca todos avatares disponíveis pra escolher
      setAvatares(avs || []);
    };
    load();
  }, []);

  const escolherAvatar = async (url: string) => { // 16. Clicou num avatar da grade
    if (!user) return;
    const { data } = await supabase.from("profiles").upsert({ id: user.id, avatar_url: url }).select().single(); // 17. Upsert - cria se não existe, atualiza se existe - salva nova url
    setProfile(data); // 18. Atualiza na tela na hora
    setShowAvatares(false); // 19. Fecha grade
  };

  if (!user) return <div className="p-8 text-white">Carregando...</div>; // 20. Enquanto busca auth

  return (
    <div className="p-4 md:p-8 bg-[#0B1325] min-h-screen text-white">
      <h1 className="text-2xl font-black text-[#E2C9A1]">MEU PERFIL</h1>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 21. CARD AVATAR */}
        <div className="bg-[#162342] border border-white/10 p-6 rounded-2xl text-center">
          <div className="w-28 h-28 mx-auto rounded-full bg-black/40 border-2 border-[#E2C9A1] overflow-hidden">
            <img src={profile?.avatar_url || avatares[0]?.url || "https://i.imgur.com/8Km9tLL.png"} className="w-full h-full object-cover" /> {/* 22. Tenta profile, senão primeiro da loja, senão fallback */}
          </div>
          <h2 className="mt-3 font-bold text-sm">{profile?.apelido || user.email.split('@')[0]}</h2> {/* 23. Apelido ou parte antes do @ */}
          <p className="text-[10px] text-zinc-500 break-all">{user.email}</p>

          <button onClick={() => setShowAvatares(!showAvatares)} className="w-full mt-4 bg-[#E2C9A1] text-black py-2.5 rounded-xl font-black text-xs">
            {showAvatares? "FECHAR" : "PERSONALIZAR AVATAR"}
          </button>

          {showAvatares && ( // 24. Grade só aparece se show = true
            <div className="mt-4 grid grid-cols-3 gap-2 p-3 bg-black/30 rounded-xl">
              {avatares.map((av) => (
                <button key={av.id} onClick={() => escolherAvatar(av.url)} className="aspect-square rounded-xl overflow-hidden border border-white/10 hover:border-[#E2C9A1] bg-white/5">
                  <img src={av.url} className="w-full h-full object-contain p-1" />
                </button>
              ))}
            </div>
          )}

          <button onClick={async () => { await supabase.auth.signOut(); window.location.href = "/login"; }} className="w-full mt-3 bg-white/5 border border-white/10 py-2.5 rounded-xl text-[10px] font-bold text-zinc-400">
            SAIR DA CONTA
          </button>
        </div>

        {/* 25. HISTORICO DE COMPRAS */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-[#162342] border border-white/10 p-6 rounded-2xl">
            <h2 className="font-bold text-xs tracking-[0.2em] text-[#E2C9A1]">HISTÓRICO DE COMPRAS</h2>
            <div className="mt-4 space-y-3">
              {pedidos.length === 0 && <p className="text-xs text-zinc-500">Você ainda não comprou nada.</p>}
              {pedidos.map((ped) => (
                <div key={ped.id} className="bg-black/30 p-4 rounded-xl flex justify-between items-center">
                  <div>
                    <p className="text-xs font-bold">PEDIDO #{ped.id.slice(0,6).toUpperCase()} • R$ {ped.valor}</p>
                    <p className="text-[10px] text-zinc-500">{new Date(ped.created_at).toLocaleDateString()} - {new Date(ped.created_at).toLocaleTimeString()}</p>
                  </div>
                  <span className={`text-[9px] px-3 py-1 rounded-full font-black ${ped.status === 'pago'? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                    {ped.status?.toUpperCase() || 'PENDENTE'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#162342] border border-white/10 p-6 rounded-2xl">
            <h2 className="font-bold text-xs tracking-[0.2em] text-[#E2C9A1]">ACOMPANHAR PEDIDO ATUAL</h2>
            <div className="mt-3 h-2 w-full bg-black/50 rounded-full overflow-hidden">
              <div className="h-full bg-[#E2C9A1] w-[70%]"></div>
            </div>
            <p className="text-[10px] text-zinc-500 mt-2">Último status: Aguardando confirmação do pagamento PIX</p>
          </div>
        </div>
      </div>
    </div>
  );
}