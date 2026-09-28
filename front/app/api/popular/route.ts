import fs from 'fs' // 1. Ler pastas
import path from 'path' // 2. Caminho
import { supabase } from "@/lib/supabaseClient" // 3. Client supabase - tabela produtos

export async function GET() { // 4. GET /api/importar-produtos - roda 1x pra migrar public -> banco
  const mapa = [ // 5. De/para pasta -> categoria
    { pasta: 'armas', categoria: 'arma' },
    { pasta: 'armaduras', categoria: 'armadura' },
    { pasta: 'armadura', categoria: 'armadura' },
    { pasta: 'escudos', categoria: 'escudo' },
    { pasta: 'escudo', categoria: 'escudo' },
    { pasta: 'municao', categoria: 'municao' },
    { pasta: 'esferas', categoria: 'esfera' },
    { pasta: 'spheres', categoria: 'esfera' },
  ]

  let total = 0 // 6. Contador novos
  for (const { pasta, categoria } of mapa) { // 7. Loop nas pastas
    const dir = path.join(process.cwd(), 'public', pasta) // 8. public/armas etc
    if (!fs.existsSync(dir)) continue // 9. Se pasta não existe pula
    const files = fs.readdirSync(dir).filter(f=>f.toLowerCase().endsWith('.png')) // 10. Só png
    
    for (const file of files) { // 11. Cada png
      const nome = file.replace(/T_ItemIcon_/gi,'').replace(/\.png/gi,'').replace(/_/g,' ').trim() // 12. Limpa nome igual /api/itens
      
      // 13. não duplica - verifica se já tem mesmo nome + categoria no banco
      const { data: existe } = await supabase.from('produtos').select('id').eq('nome', nome).eq('categoria', categoria).maybeSingle()
      if (existe) continue // 14. Já tem, pula

      await supabase.from('produtos').insert([{ // 15. Insere novo
        nome,
        imagem: `/${pasta}/${file}`, // 16. Caminho que o front usa no <img>
        arquivo: `/${pasta}/${file}`,
        categoria,
        preco: 100, // 17. Preço placeholder - muda depois no admin
        estoque: 99,
        ativo_na_loja: true
      }])
      total++ // 18. Conta
    }
  }
  return Response.json({ mensagem: `Subiu ${total} produtos novos!`, total }) // 19. Feedback
}