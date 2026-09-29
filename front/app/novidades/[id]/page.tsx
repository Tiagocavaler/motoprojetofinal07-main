import Link from "next/link";

function limpar(texto: string) { // 1. Limpa BBCode da Steam - [p] [/p] [list] etc
  if(!texto) return "";
  return texto
.replace(/\[p\]/g,"") // 2. Tira tag p
.replace(/\[\/p\]/g,"\n\n") // 3. Fecha p vira quebra dupla
.replace(/\[list\]/g,"")
.replace(/\[\/list\]/g,"")
.replace(/\[\*\]/g,"• ") // 4. Item de lista vira bolinha
.replace(/\[img\].*?\[\/img\]/g,"") // 5. Remove imagem
.replace(/\[url=?.*?\]/g,"") // 6. Remove link
.replace(/\[\/url\]/g,"")
.replace(/<[^>]*>/g,"") // 7. Remove html que sobrar
.trim();
}

async function getNoticia(id: string) { // 8. Busca notícia por gid
  // 9. busca 100 pra garantir que acha o ID da sua print - 1623730 = AppID Palworld
  const res = await fetch(`https://api.steampowered.com/ISteamNews/GetNewsForApp/v0002/?appid=1623730&count=100&format=json`, { next: { revalidate: 600 } }); // 10. revalidate 600s = ISR 10min
  const data = await res.json();
  return data.appnews.newsitems.find((n: any) => String(n.gid) === String(id)); // 11. Acha pelo gid da URL
}

export default async function NoticiaPage({ params }: { params: Promise<{ id: string }> }) { // 12. Next 15 - params é Promise
  const { id } = await params;
  const noticia = await getNoticia(id); // 13. Server component busca direto

  if(!noticia) { // 14. Não achou nas últimas 100
    return (
      <div className="min-h-screen bg-[#0B1325] text-white p-10">
        <Link href="/" className="text-sm text-[#E2C9A1]">← Voltar</Link>
        <p className="mt-10">Notícia não encontrada - ID: {id}</p>
        <p className="text-xs text-zinc-400 mt-2">Ela pode ter saído das últimas 100. Aumente o count para 200.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B1325] text-white p-6">
      <div className="max-w-3xl mx-auto"> {/* 15. Centraliza leitura */}
        <Link href="/" className="inline-block mb-6 bg-[rgba(17,28,53,0.85)] border border-[rgba(226,201,161,0.2)] px-6 py-2 rounded-full font-bold text-sm">← Voltar</Link>
        <h1 className="text-2xl md:text-3xl font-black leading-tight">{noticia.title}</h1> {/* 16. Título */}
        <p className="text-xs text-[#E2C9A1] mt-2">{new Date(noticia.date*1000).toLocaleDateString('pt-BR')}</p> {/* 17. date vem em segundos unix */}
        <div className="mt-6 bg-[#162342] border border-[rgba(226,201,161,0.15)] rounded-2xl p-6 text-[14px] leading-7 text-[#D3C9BF] whitespace-pre-wrap"> {/* 18. whitespace-pre-wrap respeita \n\n do limpar */}
          {limpar(noticia.contents)}
        </div>
        <a href={noticia.url} target="_blank" className="inline-block mt-6 text-xs text-zinc-500 underline">Ver na Steam</a> {/* 19. Link original */}
      </div>
    </div>
  );
}