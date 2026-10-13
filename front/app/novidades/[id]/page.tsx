import Link from "next/link";

export function generateStaticParams() {
  return [{ id: '1' }];
}

function limpar(texto: string) {
  if(!texto) return "";
  return texto
.replace(/\[p\]/g,"")
.replace(/\[\/p\]/g,"\n\n")
.replace(/\[list\]/g,"")
.replace(/\[\/list\]/g,"")
.replace(/\[\*\]/g,"• ")
.replace(/\[img\].*?\[\/img\]/g,"")
.replace(/\[url=?.*?\]/g,"")
.replace(/\[\/url\]/g,"")
.replace(/<[^>]*>/g,"")
.trim();
}

async function getNoticia(id: string) {
  const res = await fetch(`https://api.steampowered.com/ISteamNews/GetNewsForApp/v0002/?appid=1623730&count=100&format=json`, { next: { revalidate: 600 } });
  const data = await res.json();
  return data.appnews.newsitems.find((n: any) => String(n.gid) === String(id));
}

export default async function NoticiaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const noticia = await getNoticia(id);

  if(!noticia) {
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
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="inline-block mb-6 bg-[rgba(17,28,53,0.85)] border border-[rgba(226,201,161,0.2)] px-6 py-2 rounded-full font-bold text-sm">← Voltar</Link>
        <h1 className="text-2xl md:text-3xl font-black leading-tight">{noticia.title}</h1>
        <p className="text-xs text-[#E2C9A1] mt-2">{new Date(noticia.date*1000).toLocaleDateString('pt-BR')}</p>
        <div className="mt-6 bg-[#162342] border border-[rgba(226,201,161,0.15)] rounded-2xl p-6 text-[14px] leading-7 text-[#D3C9BF] whitespace-pre-wrap">
          {limpar(noticia.contents)}
        </div>
        <a href={noticia.url} target="_blank" className="inline-block mt-6 text-xs text-zinc-500 underline">Ver na Steam</a>
      </div>
    </div>
  );
}