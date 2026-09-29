import fs from 'fs' // 1. fs: módulo do Node pra ler pastas e arquivos do servidor - só funciona no backend
import path from 'path' // 2. path: junta caminhos de pastas de forma segura - evita bug de barra / \

// 3. GET: essa API é chamada pelo fetch('/api/avatares') do perfil
export async function GET() {
  // 4. process.cwd() = pasta raiz do projeto, + public/pals = onde estão as PNGs da loja - resultado: /seu-projeto/public/pals
  const dir = path.join(process.cwd(), 'public/pals')

  // 5. readdirSync lê TODOS os arquivos da pasta pals/ - síncrono mas ok porque é poucos arquivos
  // 6. filter só deixa passar quem termina em.png (ignora.txt,.DS_Store etc) - limpeza
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.png'))

  // 7. retorna a lista de nomes em JSON: ["T_Female_01.png", "T_Kunoichi01.png",...]
  // 8. isso economiza espaço porque o front só recebe nomes, não as imagens - front monta <img src={`/pals/${nome}`} />
  return Response.json(files)
}