import fs from 'fs';

const dir = './public/palicons'; // 1. Pasta onde você extraiu os ícones do jogo
const files = fs.readdirSync(dir); // 2. Lê tudo

console.log("Total arquivos:", files.length); // 3. Log total bruto

// 4. Filtra só Pals de verdade (tira MobuCitizen, Female, etc - são NPCs humanos que vem junto no dump)
const palsOnly = files.filter(f =>
!f.includes('Mobu') && // 5. Cidadão
!f.includes('Female') && // 6. NPC mulher
!f.includes('Male') && // 7. NPC homem
!f.includes('Shop') && // 8. Vendedor
  f.startsWith('T_') // 9. Só textura de ícone
);

console.log("Só Pals:", palsOnly.length); // 10. Deve cair de 500+ pra 200~

const map = {}; // 11. key -> lista de arquivos (pra achar duplicados)
palsOnly.forEach(f => {
  const key = f.replace('T_','').replace('_icon_normal.png','').replace('_icon.png','').replace('.png',''); // 12. Clean igual palimages.ts
  if(!map[key]) map[key] = [];
  map[key].push(f); // 13. Agrupa
});

console.log("\n--- DUPLICADOS ---"); // 14. Ex: FlowerDoll vs FlowerDoll_Fire - não é duplicado, é variante
Object.entries(map).forEach(([k,v]) => {
  if(v.length > 1) console.log(k, "=>", v.length, "arquivos"); // 15. Se tivesse _icon_normal e _icon mesmo nome
});

const uniqueKeys = Object.keys(map); // 16. Lista final única
fs.writeFileSync('./public/palicons-keys.json', JSON.stringify(uniqueKeys, null, 2)); // 17. Salva json com 233 keys - serve pra gerar palimages.ts
console.log("\n✅ Gerado: public/palicons-keys.json com", uniqueKeys.length, "Pals únicos!");