export type ItemLocal = { // 1. Type que você usa pra itens locais (fora do banco) - mock / seed / inventário do cliente
  nome: string // 2. Nome ex: "Fuzil AK-47"
  arquivo: string // 3. Caminho do arquivo 3D ou arquivo de dados - ex: "/models/ak47.glb"
  imagem: string // 4. Thumb pra mostrar no catálogo
  categoria: 'arma' | 'armadura' | 'municao' | 'esfera' | 'escudo' // 5. Union - só aceita essas 5 - ajuda no filtro e no ícone
}