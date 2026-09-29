"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

type Item = { gid: string; title: string; contents?: string; date: number; }
type Promo = { plataforma: string; desconto: string; precoAntigo: string; precoNovo: string; link: string; ativo: boolean }

function limpar(t: string) { return t.replace(/\[p\]/g,"").replace(/\[\/p\]/g,"\n\n").replace(/<[^>]*>/g,"").replace(/\[.*?\]/g,"").trim(); }

const EMAIL_ADMIN = "admin@palworld.com";
const WHATSAPP_LINK = "https://chat.whatsapp.com/CCo7ZeCGMKiDsbRjf07moW";

// LINKS OFICIAIS ONDE COMPRAR PALWORLD
const LOJAS = [
  { nome: "Steam", icone: "🎮", link: "https://store.steampowered.com/app/1623730/Palworld/", cor: "bg-[#1B2838]", desc: "PC - Melhor preço" },
  { nome: "Xbox Series X|S", icone: "🟩", link: "https://www.xbox.com/pt-BR/games/palworld", cor: "bg-[#107C10]", desc: "Xbox + Game Pass" },
  { nome: "PlayStation 5", icone: "🎮", link: "https://store.playstation.com/pt-br/product/EP3937-PPSA16438_00-PALWORLDPS50000", cor: "bg-[#003791]", desc: "PS5 - Versão completa" },
  { nome: "Microsoft Store", icone: "💻", link: "https://www.xbox.com/pt-BR/games/store/palworld/3D5C6D8C-DA9C-4D6D-BD6D-5E6C7E5C6D8C", cor: "bg-[#0078D4]", desc: "Windows PC" },
];

const WhatsAppIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M19.05 4.94A9.82 9.82 0 0 0 12.04 2C6.18 2 1.4 6.77 1.4 12.63c0 1.87.49 3.7 1.42 5.31L1 22l4.19-1.1a9.82 9.82 0 0 0 4.7 1.2h.01c5.86 0 10.64-4.77 10.64-10.63a10.58 10.58 0 0 0-3.1-7.53zM12.04 20.15h-.01a8.08 8.08 0 0 1-4.11-1.13l-.29-.17-2.49.65.66-2.43-.19-.25a8.02 8.02 0 0 1-1.23-4.19c0-4.44 3.61-8.05 8.05-8.05 2.15 0 4.17.84 5.69 2.36a7.99 7.99 0 0 1 2.36 5.69c0 4.44-3.61 8.05-8.05 8.05zm4.41-6.02c-.24-.12-1.42-.7-1.64-.78-.22-.08-.38-.12-.54.12-.16.24-.62.78-.76.94-.14.16-.28.18-.52.06-.24-.12-1.02-.37-1.94-1.19-.72-.64-1.2-1.43-1.34-1.67-.14-.24-.02-.37.1-.49.1-.1.24-.26.36-.4.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78-.2-.47-.39-.41-.54-.42h-.46c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2s.86 2.32.98 2.48c.12.16 1.69 2.58 4.1 3.62.57.25 1.02.4 1.37.51.58.18 1.1.16 1.51.1.46-.07 1.42-.58 1.62-1.14.2-.56.2-1.04.14-1.14-.06-.1-.22-.16-.46-.28z"/></svg>
);

export default function HomePage() {
  const [menuAberto, setMenuAberto] = useState(false);
  const [guiaAberto, setGuiaAberto] = useState(false);
  const [redesAberto, setRedesAberto] = useState(false);
  const [patchAberto, setPatchAberto] = useState(false);
  const [novidadesAberto, setNovidadesAberto] = useState(false);
  const [ondeComprarAberto, setOndeComprarAberto] = useState(false); // [NOVO]
  const [patch, setPatch] = useState<Item | null>(null);
  const [novidades, setNovidades] = useState<Item[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [menuLateralAberto, setMenuLateralAberto] = useState(false);
  const [subGuiaLateral, setSubGuiaLateral] = useState(false);
  const [subRedesLateral, setSubRedesLateral] = useState(false);
  const [subOndeComprarLateral, setSubOndeComprarLateral] = useState(false); // [NOVO]
  const [chatAberto, setChatAberto] = useState(false);

  // [NOVO] SISTEMA DE PROMOÇÃO E NOTIFICAÇÃO
  const [promos, setPromos] = useState<Promo[]>([]);
  const [notificacaoAtiva, setNotificacaoAtiva] = useState(false);
  const [notificacaoMsg, setNotificacaoMsg] = useState("");

  const router = useRouter();

  useEffect(() => {
    if(patchAberto &&!patch) fetch("/api/patch-notes").then(r=>r.json()).then(setPatch);
    if(novidadesAberto && novidades.length===0) fetch("/api/novidades").then(r=>r.json()).then(setNovidades);
  }, [patchAberto, novidadesAberto]);

  useEffect(() => {
    const clienteSalvo = localStorage.getItem("cliente");
    if (clienteSalvo) {
      try {
        const cliente = JSON.parse(clienteSalvo);
        setUser(cliente);
        if (cliente.email === EMAIL_ADMIN || cliente.role === "ADMIN" || cliente.role === "ROLE_ADMIN") setIsAdmin(true);
        const avatarSalvo = localStorage.getItem(`avatar_${cliente.id}`) || localStorage.getItem(`avatar_${cliente.email}`);
        if(avatarSalvo) setAvatar(avatarSalvo);
      } catch {}
    }

    // [NOVO] VERIFICAR PROMOÇÕES - Simula API de promoções
    const verificarPromocoes = async () => {
      // AQUI VOCÊ PODE INTEGRAR COM SUA API JAVA: /api/promocoes
      // Por enquanto simula uma promoção ativa
      const promosMock: Promo[] = [
        { plataforma: "Steam", desconto: "-25%", precoAntigo: "R$ 135,00", precoNovo: "R$ 101,25", link: LOJAS[0].link, ativo: true },
        { plataforma: "PlayStation", desconto: "-30%", precoAntigo: "R$ 149,90", precoNovo: "R$ 104,93", link: LOJAS[2].link, ativo: false },
      ];

      // Filtra só ativas
      const ativas = promosMock.filter(p => p.ativo);
      setPromos(ativas);

      if(ativas.length > 0) {
        const ultimaPromoVista = localStorage.getItem("ultima_promo_vista");
        const promoAtualId = JSON.stringify(ativas);

        if(ultimaPromoVista!== promoAtualId) {
          setNotificacaoAtiva(true);
          setNotificacaoMsg(`🔥 PROMOÇÃO: ${ativas[0].plataforma} ${ativas[0].desconto} OFF!`);

          // Notificação do navegador
          if(Notification && Notification.permission === "granted") {
            new Notification("ComunidadeClt - Promoção Palworld!", {
              body: `${ativas[0].plataforma} com ${ativas[0].desconto} de desconto! De ${ativas[0].precoAntigo} por ${ativas[0].precoNovo}`,
              icon: "/favicon.ico"
            });
          } else if(Notification && Notification.permission!== "denied") {
            Notification.requestPermission();
          }

          // Salva que já notificou
          localStorage.setItem("ultima_promo_vista", promoAtualId);
        }
      }
    };

    verificarPromocoes();
    // Verifica a cada 5 minutos
    const interval = setInterval(verificarPromocoes, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = async () => {
    localStorage.removeItem("cliente"); localStorage.removeItem("cliente_id"); localStorage.removeItem("token");
    setUser(null); setIsAdmin(false); setAvatar(null); router.push("/login");
  };

  const fecharTudo = () => { setGuiaAberto(false); setRedesAberto(false); setPatchAberto(false); setNovidadesAberto(false); setOndeComprarAberto(false); }
  const enviarWhatsApp = () => { window.open(WHATSAPP_LINK, "_blank"); setChatAberto(false); };

  return (
    <div className="relative w-full min-h-screen overflow-hidden bg-[#0B1325] text-white">
      <img src="/home.gif" alt="background" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-black/65 backdrop-blur-[1px]" />

      {/* NOTIFICAÇÃO DE PROMOÇÃO */}
      {notificacaoAtiva && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-[#E2C9A1] text-black px-6 py-3 rounded-full font-black text-sm shadow-2xl flex items-center gap-3 animate-bounce">
          <span>{notificacaoMsg}</span>
          <button onClick={() => { setOndeComprarAberto(true); setNotificacaoAtiva(false); }} className="bg-black text-white px-3 py-1 rounded-full text-xs">VER</button>
          <button onClick={() => setNotificacaoAtiva(false)} className="ml-2">✕</button>
        </div>
      )}

      {menuLateralAberto && <div onClick={() => setMenuLateralAberto(false)} className="absolute inset-0 bg-black/60 z-20 backdrop-blur-sm" />}

      <div className={`absolute top-0 left-0 h-full w-[320px] bg-[#0B1325] border-r border-[#1F2E4F] z-30 shadow-2xl transition-transform duration-300 ${menuLateralAberto? "translate-x-0" : "-translate-x-full"}`}>
        <div className="p-6 flex flex-col h-full overflow-y-auto">
          <div className="flex items-center justify-between"><h2 className="font-black text-lg text-[#E2C9A1]">MENU</h2><button onClick={() => setMenuLateralAberto(false)} className="bg-white/10 w-8 h-8 rounded-full">✕</button></div>
          {user? (<Link href="/perfil" onClick={() => setMenuLateralAberto(false)} className="mt-6 flex items-center gap-3 bg-[#162342] p-3 rounded-xl border border-[#E2C9A1]/20"><img src={avatar || "https://i.pravatar.cc/100"} className="w-10 h-10 rounded-full bg-white border-2 border-[#E2C9A1]" /><div><p className="font-bold text-sm">{user.nome || user.email?.split("@")[0]}</p><p className="text-[11px] text-[#E2C9A1]">Ver perfil →</p></div></Link>) : <Link href="/login" className="mt-6 block text-center bg-[#E2C9A1] text-black py-3 rounded-xl font-black text-sm">Login</Link>}
          <div className="mt-6 flex flex-col gap-2">
            <Link href="/perfil" className="bg-[#1E2F5A] border border-[#E2C9A1]/30 py-3 px-4 rounded-xl font-bold text-sm">👤 Meu Perfil</Link>
            <Link href="/catalogo" className="bg-[#E2C9A1] text-[#0B1325] py-3 px-4 rounded-xl font-bold text-sm">🛒 Catálogo</Link>

            {/* [NOVO] ONDE COMPRAR NA LATERAL */}
            <button onClick={() => setSubOndeComprarLateral(!subOndeComprarLateral)} className="bg-[#E2C9A1]/20 border border-[#E2C9A1]/40 py-3 px-4 rounded-xl font-bold text-sm flex justify-between text-[#E2C9A1]">🛒 Onde Comprar {promos.length>0 && <span className="bg-red-500 text-white text-[10px] px-2 rounded-full animate-pulse">PROMO</span>} <span>{subOndeComprarLateral?"▲":"▼"}</span></button>
            {subOndeComprarLateral && <div className="ml-2 flex flex-col gap-2">{LOJAS.map(loja => (<a key={loja.nome} href={loja.link} target="_blank" className={`block ${loja.cor} py-3 px-4 rounded-xl text-sm font-bold text-center`}>{loja.icone} {loja.nome} <span className="block text-[10px] font-normal opacity-70">{loja.desc}</span></a>))}{promos.length>0 && <div className="bg-red-500/20 border border-red-500/30 p-3 rounded-xl"><p className="text-xs font-black text-red-300">🔥 PROMOÇÃO ATIVA</p><p className="text-xs mt-1">{promos[0].plataforma}: {promos[0].precoAntigo} → {promos[0].precoNovo}</p></div>}</div>}

            <button onClick={() => setSubRedesLateral(!subRedesLateral)} className="bg-[#162342] py-3 px-4 rounded-xl font-bold text-sm flex justify-between">📡 Nossas Redes <span>{subRedesLateral?"▲":"▼"}</span></button>
            {subRedesLateral && <div className="ml-4 bg-black/20 rounded-xl"><a href={WHATSAPP_LINK} target="_blank" className="flex items-center gap-2 py-2 px-4 text-sm text-green-300"><WhatsAppIcon className="w-4 h-4" /> WhatsApp</a></div>}
            <Link href="/novidades" className="bg-[#162342] py-3 px-4 rounded-xl font-bold text-sm">📰 Novidades</Link>
            <Link href="/patch-notes" className="bg-[#162342] py-3 px-4 rounded-xl font-bold text-sm">📝 Patch Notes</Link>
          </div>
        </div>
      </div>

      <div className="relative z-10 w-full min-h-screen flex flex-col p-4 md:p-6">
        <div className="w-full max-w-[1400px] mx-auto flex justify-between gap-3 flex-wrap items-start">
          <button onClick={() => setMenuLateralAberto(true)} className="bg-[#162342] border border-[rgba(226,201,161,0.3)] px-6 py-2 rounded-full font-black text-sm">☰ Menu</button>

          <div className="flex gap-3 flex-wrap items-start justify-end">
            <div className="hidden md:flex gap-3 flex-wrap justify-end items-center">

              {/* [NOVO] BOTÃO ONDE COMPRAR DO LADO DE NOSSAS REDES */}
              <div className="relative">
                <button onClick={() => { fecharTudo(); setOndeComprarAberto(!ondeComprarAberto); }} className="bg-[#E2C9A1] text-[#0B1325] border border-[#E2C9A1] px-6 py-2 rounded-full font-black text-sm flex items-center gap-2 hover:bg-white transition relative">
                  🛒 Onde Comprar
                  {promos.length>0 && <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center animate-pulse">!</span>}
                  {ondeComprarAberto?"▲":"▼"}
                </button>
                {ondeComprarAberto && (
                  <div className="absolute top-[50px] right-0 w-[380px] bg-[#162342] border border-[#E2C9A1]/30 rounded-2xl overflow-hidden shadow-2xl z-20">
                    <div className="py-3 text-center bg-[#0B1325]"><p className="text-[11px] tracking-[4px] text-[#E2C9A1] font-black">ONDE COMPRAR PALWORLD</p><p className="text-[10px] text-white/50 mt-1">Todas as plataformas oficiais</p></div>

                    {promos.length>0 && (
                      <div className="m-3 bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500/40 p-3 rounded-xl">
                        <p className="text-xs font-black text-red-300 flex items-center gap-2">🔥 PROMOÇÃO ATIVA AGORA! <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full animate-pulse">LIMITADO</span></p>
                        {promos.map(p => (
                          <div key={p.plataforma} className="mt-2 flex justify-between items-center bg-black/20 p-2 rounded-lg">
                            <div><p className="text-xs font-bold">{p.plataforma} {p.desconto}</p><p className="text-[11px]"><span className="line-through opacity-50">{p.precoAntigo}</span> <span className="text-green-300 font-black">{p.precoNovo}</span></p></div>
                            <a href={p.link} target="_blank" className="bg-[#E2C9A1] text-black px-3 py-1 rounded-full text-xs font-black">COMPRAR</a>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="p-3 grid gap-2">
                      {LOJAS.map(loja => (
                        <a key={loja.nome} href={loja.link} target="_blank" className={`${loja.cor} hover:opacity-90 p-4 rounded-xl flex items-center justify-between group transition`}>
                          <div className="flex items-center gap-3"><span className="text-2xl">{loja.icone}</span><div><p className="font-black text-sm text-white">{loja.nome}</p><p className="text-[11px] text-white/70">{loja.desc}</p></div></div>
                          <span className="text-white group-hover:translate-x-1 transition">→</span>
                        </a>
                      ))}
                    </div>

                    <div className="p-3 bg-black/20 border-t border-white/5">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" onChange={(e) => { if(e.target.checked) Notification.requestPermission(); }} className="rounded" />
                        <span className="text-[11px] text-white/70">🔔 Me notificar quando tiver promoção</span>
                      </label>
                      <p className="text-[10px] text-white/40 mt-2">Você receberá notificação no navegador e aqui na home sempre que houver desconto.</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="relative">
                <button onClick={() => { fecharTudo(); setRedesAberto(!redesAberto); }} className="bg-[rgba(17,28,53,0.85)] border border-[rgba(226,201,161,0.2)] px-6 py-2 rounded-full font-bold text-sm">Nossas Redes {redesAberto?"▲":"▼"}</button>
                {redesAberto && <div className="absolute top-[50px] right-0 w-[240px] bg-[#162342] border border-white/10 rounded-xl overflow-hidden shadow-2xl z-20"><a href={WHATSAPP_LINK} target="_blank" className="flex items-center justify-center gap-2 py-3 text-center text-sm hover:bg-white/5 text-green-300"><WhatsAppIcon className="w-4 h-4" /> WhatsApp</a><a href="https://vt.tiktok.com/ZSbRLW4KL/" target="_blank" className="block py-3 text-center text-sm hover:bg-white/5">TikTok</a><a href="https://discord.gg/K39jJXBJQ" target="_blank" className="block py-3 text-center text-sm hover:bg-white/5">Discord</a></div>}
              </div>
              <div className="relative"><button onClick={() => { fecharTudo(); setNovidadesAberto(!novidadesAberto); }} className="bg-[rgba(17,28,53,0.85)] border border-[rgba(226,201,161,0.2)] px-6 py-2 rounded-full font-bold text-sm">Novidades {novidadesAberto?"▲":"▼"}</button>{novidadesAberto && <div className="absolute top-[50px] right-0 w-[360px] bg-[#162342] border border-white/10 rounded-xl overflow-hidden shadow-2xl z-20"><div className="max-h-[400px] overflow-y-auto">{novidades.map(n=>(<Link key={n.gid} href={`/novidades/${n.gid}`} className="block p-4 border-b border-white/5 hover:bg-white/10"><p className="text-[13px] font-bold">{n.title}</p></Link>))}</div></div>}</div>
              <div className="relative"><button onClick={() => { fecharTudo(); setPatchAberto(!patchAberto); }} className="bg-[rgba(17,28,53,0.85)] border border-[rgba(226,201,161,0.2)] px-6 py-2 rounded-full font-bold text-sm">Patch Notes {patchAberto?"▲":"▼"}</button>{patchAberto && <div className="absolute top-[50px] right-0 w-[380px] bg-[#162342] border border-white/10 rounded-xl overflow-hidden shadow-2xl z-20"><div className="p-4">{!patch? <p>Carregando...</p>: <><p className="font-black">{patch.title}</p><p className="text-xs mt-3 line-clamp-4">{limpar(patch.contents||"")}</p></>}</div><Link href="/patch-notes" className="block py-3 text-center text-xs font-bold bg-[#E2C9A1] text-[#0B1325]">Ver completo →</Link></div>}</div>
              <div className="relative"><button onClick={() => { fecharTudo(); setGuiaAberto(!guiaAberto); }} className="bg-[rgba(17,28,53,0.85)] border border-[rgba(226,201,161,0.2)] px-6 py-2 rounded-full font-bold text-sm">Guia {guiaAberto?"▲":"▼"}</button>{guiaAberto && <div className="absolute top-[50px] right-0 w-[240px] bg-[#162342] border border-white/10 rounded-xl overflow-hidden shadow-2xl z-20"><Link href="/guia/breeding" className="block py-3 text-center text-sm">Breeding</Link><Link href="/guia/mapa" className="block py-3 text-center text-sm">Mapa</Link><Link href="/guia/pals" className="block py-3 text-center text-sm">Pals</Link></div>}</div>
            </div>

            <Link href="/catalogo" className="bg-[#E2C9A1] text-[#0B1325] px-6 py-2 rounded-full font-bold text-sm">Catálogo</Link>
            {user? (<><Link href="/perfil" className="bg-[#1E2F5A] border border-[#E2C9A1]/40 text-white px-4 py-2 rounded-full font-bold text-sm flex items-center gap-2"><img src={avatar || "https://i.pravatar.cc/100"} className="w-6 h-6 rounded-full bg-white" />Perfil</Link><button onClick={handleLogout} className="bg-red-500/20 border border-red-500/40 text-red-200 px-6 py-2 rounded-full font-bold text-sm">Sair</button></>) : <Link href="/login" className="bg-white/10 px-6 py-2 rounded-full font-bold text-sm">Login</Link>}
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center">
          <h1 className="text-5xl md:text-6xl font-black text-center">Bem vindo a ComunidadeClt!</h1>
          <p className="mt-4 text-[#D3C9BF]">Guia aberto pra todos. Produtos só para o vendedor.</p>
          {promos.length>0 && <div className="mt-6 bg-[#E2C9A1] text-black px-6 py-2 rounded-full font-black text-sm animate-pulse">🔥 {promos[0].plataforma} com {promos[0].desconto} OFF - Clique em Onde Comprar!</div>}
        </div>
      </div>

      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
        {chatAberto && (<div className="mb-4 w-[350px] bg-white rounded-2xl shadow-2xl overflow-hidden"><div className="bg-[#075E54] p-4 flex items-center gap-3"><div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-[#25D366]"><WhatsAppIcon className="w-7 h-7" /></div><div className="flex-1"><p className="font-black text-white text-sm">ComunidadeClt</p><p className="text-[11px] text-green-200">Online - Suporte</p></div><button onClick={() => setChatAberto(false)} className="text-white/70">✕</button></div><div className="p-3 bg-[#F0F0F0]"><button onClick={enviarWhatsApp} className="w-full bg-[#25D366] text-white py-3 rounded-full font-black text-sm flex items-center justify-center gap-2"><WhatsAppIcon className="w-5 h-5" /> Abrir WhatsApp</button></div></div>)}
        <button onClick={() => setChatAberto(!chatAberto)} className="w-[60px] h-[60px] bg-[#25D366] rounded-full shadow-2xl flex items-center justify-center text-white border-2 border-white">{chatAberto? "✕" : <WhatsAppIcon className="w-8 h-8" />}</button>
      </div>
    </div>
  );
}