import Link from "next/link";

function limpar(texto: string) { // 1. Mesmo limpar da página de notícia - BBCode -> texto
  if(!texto) return "";
  return texto.replace(/\[p\]/g,"").replace(/\[\/p\]/g,"\n\n").replace(/\[list\]/g,"").replace(/\[\/list\]/g,"").replace(/\[\*\]/g,"• ").replace(/\[img\].*?\[\/img\]/g,"").replace(/\[url=?.*?\]/g,"").replace(/\[\/url\]/g,"").replace(/<[^>]*>/g,"").trim();
}

async function getPatch() { // 2. Pega só 1 - último patch
  const res = await fetch("https://api.steampowered.com/ISteamNews/GetNewsForApp/v0002/?appid=1623730&count=1&tags=patchnotes&format=json", { next: { revalidate: 3600 } }); // 3. tags=patchnotes filtra - revalidate 1h
  const data = await res.json();
  return data.appnews.newsitems[0]; // 4. Primeiro = mais recente
}

export default async function PatchNotesPage() { // 5. Server component - página /patch-notes
  const patch = await getPatch(); // 6. Busca no servidor - SEO

  return (
    <div className="min-h-screen bg-[#0B1325] text-white p-6">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="inline-block mb-6 bg-[#162342] border border-[#E2C9A1]/20 px-6 py-2 rounded-full text-sm font-bold">← Voltar</Link>

        <div className="flex items-center gap-3">
          <span className="text-[11px] tracking-[4px] text-[#E2C9A1] font-black">PATCH ATUAL</span> {/* 7. Label */}
          <span className="text-[10px] bg-[#E2C9A1] text-[#0B1325] px-2 py-1 rounded-full font-bold">AUTO-ATUALIZÁVEL</span> {/* 8. Badge - avisa que é dinâmico */}
        </div>

        <h1 className="text-3xl font-black mt-3">{patch.title}</h1> {/* 9. Título do patch v1.0.5 etc */}
        <p className="text-xs text-[#E2C9A1] mt-2">{new Date(patch.date*1000).toLocaleDateString('pt-BR')}</p> {/* 10. Data */}

        <div className="mt-6 bg-[#162342] border border-white/5 rounded-2xl p-6 text-[14px] leading-7 text-[#D3C9BF] whitespace-pre-wrap">
          {limpar(patch.contents)} {/* 11. Conteúdo limpo */}
        </div>

        <p className="text-[11px] text-zinc-500 mt-4">Quando sair o v1.0.6, essa página atualiza sozinha e o v1.0.5 apaga.</p> {/* 12. Aviso - count=1 só guarda último */}
      </div>
    </div>
  );
}