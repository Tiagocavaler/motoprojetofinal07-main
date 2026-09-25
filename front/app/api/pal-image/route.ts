import { NextResponse } from 'next/server'; // 1. Resposta binária
import fs from 'fs'; // 2. Ler arquivo local
import path from 'path'; // 3. Caminho

export async function GET(req: Request) { // 4. GET /api/pal-image?key=xxx&file=xxx.png - proxy de imagem
  const { searchParams } = new URL(req.url); // 5. Pega querystring
  const key = searchParams.get('key'); // 6. key = id do Pal pra buscar externo - ex: lamball
  const fileName = searchParams.get('file'); // 7. fileName = arquivo local que já tá em /public/palicons
  if(!key && !fileName) return new NextResponse('missing key', { status: 400 }); // 8. Tem que ter um dos dois

  // 9. 1. Tenta local primeiro - você já tem 154 arquivos - evita request externo
  if(fileName){
    const localPath = path.join(process.cwd(), 'public', 'palicons', fileName); // 10. /public/palicons/xxxx.png
    if(fs.existsSync(localPath)){ // 11. Se existe local
      const buf = fs.readFileSync(localPath); // 12. Lê buffer
      return new NextResponse(buf, { // 13. Devolve como imagem
        headers: { 'Content-Type': 'image/png', 'Cache-Control':'public, max-age=86400, immutable' } // 14. Cache 1 dia, immutable - performance
      });
    }
  }

  // 15. 2. Fallback externo só se não tiver local (Terraria novo) - se local falhou, tenta baixar
  const urls = [ // 16. Lista de CDNs pra tentar - ordem importa
    `https://paldb.cc/images/pals/${key}.png`,
    `https://paldb.cc/images/pals/${key}_1.png`, // 17. Variação com _1
    `https://palworld.gg/images/pals/${key}.png`,
  ];

  for(const url of urls){ // 18. Tenta uma por uma
    try{
      const res = await fetch(url, { headers: { 'User-Agent':'Mozilla/5.0' } }); // 19. User-Agent pra não tomar 403 de bot
      if(res.ok){ // 20. Achou
        const buf = await res.arrayBuffer(); // 21. Buffer externo
        return new NextResponse(buf, { // 22. Repassa como se fosse sua
          headers: { 'Content-Type': 'image/png', 'Cache-Control':'public, max-age=86400' }
        });
      }
    }catch{} // 23. Ignora erro e tenta próxima url
  }
  return new NextResponse(null, { status: 404 }); // 24. Nenhuma funcionou
}