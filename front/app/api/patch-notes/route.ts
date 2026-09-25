import { NextResponse } from "next/server"; // 1. Resposta
export async function GET() { // 2. GET /api/patch-notes - só patch
  try {
    const res = await fetch("https://api.steampowered.com/ISteamNews/GetNewsForApp/v0002/?appid=1623730&count=1&tags=patchnotes&format=json", { next: { revalidate: 3600 } }); // 3. Mesmo endpoint do de notícias mas com tags=patchnotes e count=1 - só último patch - revalidate 1h pra não spam Steam
    const data = await res.json(); // 4. { appnews: { newsitems: [ { title, contents etc } ] } }
    return NextResponse.json(data.appnews.newsitems[0]); // 5. Devolve só primeiro item - último patch
  } catch (e) { // 6. Erro
    return NextResponse.json(null); // 7. null pra front tratar - diferente do de notícias que devolve []
  }
}