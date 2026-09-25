import { NextResponse } from "next/server"; // 1. Resposta
export async function GET() { // 2. GET /api/noticias-palworld
  try {
    const res = await fetch("https://api.steampowered.com/ISteamNews/GetNewsForApp/v0002/?appid=1623730&count=50&format=json", { next: { revalidate: 3600 } }); // 3. Pega news do Steam - appid 1623730 = Palworld - count 50 - revalidate 3600 = cache 1h pra não tomar rate limit da Steam
    const data = await res.json(); // 4. { appnews: { newsitems: [...] } }
    // 5. FILTRO: remove tudo que é patch notes, sobra só novidade do jogo
    const novidades = data.appnews.newsitems.filter((n: any) =>!n.tags?.includes("patchnotes")); // 6. tags patchnotes = changelog chato, você só quer evento/novidade
    return NextResponse.json(novidades.slice(0, 10)); // 7. Só 10 primeiras
  } catch (e) { // 8. Steam off
    return NextResponse.json([]); // 9. Devolve vazio pra não quebrar o front
  }
}