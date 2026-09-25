"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";

type Item = { gid: string; title: string; contents?: string; date: number; } // 2. Tipo patch/novidades - gid id do steam/rss
function limpar(t: string) { return t.replace(/\[p\]/g,"").replace(/\[\/p\]/g,"\n\n").replace(/<[^>]*>/g,"").replace(/\[.*?\]/g,"").trim(); } // 3. Limpa bbcode/html do patch notes

// 4. COLOCA SEU EMAIL DE ADMIN AQUI - checagem só no front, inseguro
const EMAIL_ADMIN = "seu-email-admin@gmail.com";

export default function HomePage() {
  const [menuAberto, setMenuAberto] = useState(false); // 5. Menu mobile
  const [guiaAberto, setGuiaAberto] = useState(false); // 6. Dropdowns
  const [redesAberto, setRedesAberto] = useState(false);
  const [patchAberto, setPatchAberto] = useState(false);
  const [novidadesAberto, setNovidadesAberto] = useState(false);
  const [patch, setPatch] = useState<Item | null>(null); // 7. Dados api
  const [novidades, setNovidades] = useState<Item[]>([]);
  const [isAdmin, setIsAdmin] = useState(false); // 8. Mostra Área Restrita

  useEffect(() => { // 9. Lazy load - só busca quando abre dropdown
    if(patchAberto &&!patch) fetch("/api/patch-notes").then(r=>r.json()).then(setPatch);
    if(novidadesAberto && novidades.length===0) fetch("/api/novidades").then(r=>r.json()).then(setNovidades);
  }, [patchAberto, novidadesAberto]);

  useEffect(() => { // 10. Checa admin por email
    const checkAdmin = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user && user.email === EMAIL_ADMIN) {
        setIsAdmin(true);
      }
    };
    checkAdmin();
  }, []);

  const fecharTudo = () => { setGuiaAberto(false); setRedesAberto(false); setPatchAberto(false); setNovidadesAberto(false); } // 11. Fecha outros dropdowns

  return (
    <div className="relative w-full min-h-screen overflow-hidden bg-[#0B1325] text-white">
      <img src="/home.gif" alt="background" className="absolute inset-0 w-full h-full object-cover" /> {/* 12. Fundo gif */}
      <div className="absolute inset-0 bg-black/65 backdrop-blur-[1px]" /> {/* 13. Escurece gif */}

      <div className="relative z-10 w-full min-h-screen flex flex-col p-4 md:p-6">
        <div className="w-full max-w-[1280px] mx-auto flex justify-end gap-3 flex-wrap items-start"> {/* 14. Header com botões na direita */}

          <div className="relative md:hidden"> {/* 15. Mobile - botão Menu com tudo dentro */}
            <button onClick={() => setMenuAberto(!menuAberto)} className="bg-[#162342] border border-[rgba(226,201,161,0.3)] px-6 py-2 rounded-full font-black text-sm">
              Menu {menuAberto? "✕" : "☰"}
            </button>
            {menuAberto && (
              <div className="absolute top-[50px] right-0 w-[300px] bg-[#0B1325] border border-white/10 rounded-2xl p-3 shadow-2xl z-30 flex flex-col gap-2">
                {/* 16. Mesmo conteúdo duplicado - mobile */}
                <button onClick={()=>{ fecharTudo(); setRedesAberto(!redesAberto); }} className="w-full bg-[rgba(22,35,66,0.9)] py-3 rounded-xl text-sm font-bold">Nossas Redes {redesAberto?"▲":"▼"}</button>
                {redesAberto && <div className="bg-[#162342] rounded-xl overflow-hidden"><a href="https://chat.whatsapp.com/CCo7ZeCGMKiDsbRjf07moW" target="_blank" className="block py-2 text-center text-sm">WhatsApp</a><a href="https://vt.tiktok.com/ZSbRLW4KL/" target="_blank" className="block py-2 text-center text-sm">TikTok</a><a href="https://discord.gg/K39jJXBJQ" target="_blank" className="block py-2 text-center text-sm">Discord</a></div>}

                <button onClick={()=>{ fecharTudo(); setNovidadesAberto(!novidadesAberto); }} className="w-full bg-[rgba(22,35,66,0.9)] py-3 rounded-xl text-sm font-bold">Novidades {novidadesAberto?"▲":"▼"}</button>
                {novidadesAberto && <div className="bg-[#162342] rounded-xl max-h-[200px] overflow-y-auto">{novidades.map(n=>(<Link key={n.gid} href={`/novidades/${n.gid}`} className="block p-3 border-b border-white/5 text-xs">{n.title}</Link>))}</div>}

                <button onClick={()=>{ fecharTudo(); setPatchAberto(!patchAberto); }} className="w-full bg-[rgba(22,35,66,0.9)] py-3 rounded-xl text-sm font-bold">Patch Notes {patchAberto?"▲":"▼"}</button>
                {patchAberto && <div className="bg-[#162342] rounded-xl p-3 text-xs"><p className="font-bold">{patch?.title}</p><Link href="/patch-notes" className="block mt-2 text-[#E2C9A1] text-center font-bold">Ver página completa →</Link></div>}

                <button onClick={()=>{ fecharTudo(); setGuiaAberto(!guiaAberto); }} className="w-full bg-[rgba(22,35,66,0.9)] py-3 rounded-xl text-sm font-bold">Guia {guiaAberto?"▲":"▼"}</button>
                {guiaAberto && <div className="bg-[#162342] rounded-xl overflow-hidden"><Link href="/guia/breeding" className="block py-2 text-center text-sm">Breeding</Link><Link href="/guia/mapa" className="block py-2 text-center text-sm">Mapa</Link><Link href="/guia/pals" className="block py-2 text-center text-sm">Pals</Link></div>}

                <Link href="/catalogo" className="w-full text-center bg-[#E2C9A1] text-[#0B1325] py-3 rounded-xl font-bold text-sm">Catálogo</Link>
                {isAdmin && <Link href="/admin" className="w-full text-center bg-white text-black py-3 rounded-xl font-bold text-sm">Área Restrita</Link>}
              </div>
            )}
          </div>

          <div className="hidden md:flex gap-3 flex-wrap justify-end"> {/* 17. Desktop - dropdowns separados */}
            <div className="relative">
              <button onClick={() => { fecharTudo(); setRedesAberto(!redesAberto); }} className="bg-[rgba(17,28,53,0.85)] border border-[rgba(226,201,161,0.2)] px-6 py-2 rounded-full font-bold text-sm">Nossas Redes {redesAberto?"▲":"▼"}</button>
              {redesAberto && <div className="absolute top-[50px] right-0 w-[240px] bg-[#162342] border border-white/10 rounded-xl overflow-hidden shadow-2xl z-20"><div className="py-2 text-center text-[11px] tracking-[4px] text-[#E2C9A1] font-black">NOSSAS REDES</div><a href="https://chat.whatsapp.com/CCo7ZeCGMKiDsbRjf07moW" target="_blank" className="block py-3 text-center text-sm hover:bg-white/5">WhatsApp</a><a href="https://vt.tiktok.com/ZSbRLW4KL/" target="_blank" className="block py-3 text-center text-sm hover:bg-white/5">TikTok</a><a href="https://discord.gg/K39jJXBJQ" target="_blank" className="block py-3 text-center text-sm hover:bg-white/5">Discord</a></div>}
            </div>
            <div className="relative">
              <button onClick={() => { fecharTudo(); setNovidadesAberto(!novidadesAberto); }} className="bg-[rgba(17,28,53,0.85)] border border-[rgba(226,201,161,0.2)] px-6 py-2 rounded-full font-bold text-sm">Novidades {novidadesAberto?"▲":"▼"}</button>
              {novidadesAberto && <div className="absolute top-[50px] right-0 w-[360px] bg-[#162342] border border-white/10 rounded-xl overflow-hidden shadow-2xl z-20"><div className="py-2 text-center text-[11px] tracking-[4px] text-[#E2C9A1] font-black">NOVIDADES</div><div className="max-h-[400px] overflow-y-auto">{novidades.map(n=>(<Link key={n.gid} href={`/novidades/${n.gid}`} onClick={()=>setNovidadesAberto(false)} className="block p-4 border-b border-white/5 hover:bg-white/10"><p className="text-[13px] font-bold line-clamp-2">{n.title}</p><p className="text-[10px] text-[#E2C9A1] mt-1">{new Date(n.date*1000).toLocaleDateString('pt-BR')}</p></Link>))}</div></div>}
            </div>
            <div className="relative">
              <button onClick={() => { fecharTudo(); setPatchAberto(!patchAberto); }} className="bg-[rgba(17,28,53,0.85)] border border-[rgba(226,201,161,0.2)] px-6 py-2 rounded-full font-bold text-sm">Patch Notes {patchAberto?"▲":"▼"}</button>
              {patchAberto && <div className="absolute top-[50px] right-0 w-[380px] bg-[#162342] border border-white/10 rounded-xl overflow-hidden shadow-2xl z-20"><div className="py-2 text-center text-[11px] tracking-[4px] text-[#E2C9A1] font-black">PATCH ATUAL</div><div className="max-h-[300px] overflow-y-auto p-4">{!patch? <p className="text-xs">Carregando...</p>: <><p className="font-black text-[14px]">{patch.title}</p><p className="text-[12px] mt-3 line-clamp-4 whitespace-pre-wrap">{limpar(patch.contents||"")}</p></>}</div><Link href="/patch-notes" className="block py-3 text-center text-xs font-bold bg-[#E2C9A1] text-[#0B1325]">Ver página completa →</Link></div>}
            </div>
            <div className="relative">
              <button onClick={() => { fecharTudo(); setGuiaAberto(!guiaAberto); }} className="bg-[rgba(17,28,53,0.85)] border border-[rgba(226,201,161,0.2)] px-6 py-2 rounded-full font-bold text-sm">Guia {guiaAberto?"▲":"▼"}</button>
              {guiaAberto && <div className="absolute top-[50px] right-0 w-[240px] bg-[#162342] border border-white/10 rounded-xl overflow-hidden shadow-2xl z-20"><Link href="/guia/breeding" className="block py-3 text-center text-sm hover:bg-white/5">Breeding Calculadora</Link><Link href="/guia/mapa" className="block py-3 text-center text-sm hover:bg-white/5">Mapa Interativo</Link><Link href="/guia/pals" className="block py-3 text-center text-sm hover:bg-white/5">Tabela de Pals</Link></div>}
            </div>
          </div>

          <Link href="/catalogo" className="bg-[#E2C9A1] text-[#0B1325] px-6 py-2 rounded-full font-bold text-sm">Catálogo</Link> {/* 18. Links fixos */}
          {isAdmin? (
            <Link href="/admin" className="bg-white text-black px-6 py-2 rounded-full font-bold text-sm">Área Restrita</Link>
          ) : (
            <Link href="/login" className="bg-white/10 border border-white/10 px-6 py-2 rounded-full font-bold text-sm">Login</Link>
          )}
        </div>

        <div className="flex-1 flex flex-col items-center justify-center"> {/* 19. Centro */}
          <h1 className="text-5xl md:text-6xl font-black text-center text-[#FAF9F6]">Bem vindo a ComunidadeClt!</h1>
          <p className="mt-4 text-[#D3C9BF]">Guia aberto pra todos. Produtos só para o vendedor.</p>
        </div>
      </div>
    </div>
  );
}