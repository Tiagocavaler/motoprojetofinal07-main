import fs from 'fs' // 1. Ler pasta
import path from 'path' // 2. Juntar caminho

function limparNome(file: string) { // 3. Tira sujeira do nome do arquivo pra virar nome bonito na loja
  return file
    .replace(/T_ItemIcon_/gi, '') // 4. Remove prefixo comum - ex: T_ItemIcon_Sword.png -> Sword.png
    .replace(/\.png/gi, '') // 5. Remove .png
    .replace(/_/g, ' ') // 6. _ vira espaço - Long_Sword -> Long Sword
    .trim() // 7. Tira espaço extra
}

function listar(pasta: string, categoria: string) { // 8. Função genérica pra ler qualquer pasta e já taggear categoria
  const dir = path.join(process.cwd(), 'public', pasta) // 9. public/armas, public/armadura etc
  if (!fs.existsSync(dir)) return [] // 10. Se pasta não existe não quebra - retorna vazio - por isso você pode listar 'armas' e 'arma' sem medo
  
  return fs.readdirSync(dir)
    .filter(f => f.toLowerCase().endsWith('.png')) // 11. Só png
    .map(file => ({ // 12. Transforma em objeto padrão da loja
      nome: limparNome(file), // 13. Nome limpo
      arquivo: `/${pasta}/${file}`, // 14. Caminho pro <img src>
      imagem: `/${pasta}/${file}`, // 15. Duplicado pra compatibilidade com seu código do admin que usa .imagem e .arquivo
      categoria // 16. arma, armadura etc - usado no filtro
    }))
}

export async function GET() { // 17. GET /api/itens - é esse que o admin usa pra listar PUBLIC
  const itens = [ // 18. Junta tudo - tenta variações de nome de pasta porque você não sabe se criou como 'armas' ou 'arma'
    ...listar('armas', 'arma'),
    ...listar('arma', 'arma'),
    ...listar('armaduras', 'armadura'),
    ...listar('armadura', 'armadura'),
    ...listar('escudos', 'escudo'),
    ...listar('escudo', 'escudo'),
    ...listar('municao', 'municao'),
    ...listar('munição', 'municao'), // 19. Até com acento - fs.existsSync protege
    ...listar('esferas', 'esfera'),
    ...listar('spheres', 'esfera'),
    ...listar('sphere', 'esfera'),
  ]

  // 20. Remove duplicado pelo nome do arquivo - Map chave = arquivo, valor = objeto, se repetir sobrescreve
  const unicos = Array.from(new Map(itens.map(i => [i.arquivo, i])).values())
  
  // 21. Ordena por nome - A-Z na loja
  unicos.sort((a,b) => a.nome.localeCompare(b.nome))

  return Response.json(unicos) // 22. Devolve lista limpa pro front
}