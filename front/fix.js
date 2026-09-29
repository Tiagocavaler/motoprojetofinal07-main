const fs = require('fs');
const path = require('path');

function varrer(dir) {
  const itens = fs.readdirSync(dir);
  for (const item of itens) {
    const full = path.join(dir, item);
    if (fs.statSync(full).isDirectory()) {
      varrer(full);
    } else if (full.endsWith('.tsx') || full.endsWith('.ts')) {
      let conteudo = fs.readFileSync(full, 'utf8');
      // Corrige "use client"; // comentário -> deixa só "use client"; + quebra linha
      if (conteudo.includes('"use client"; //') || conteudo.includes("'use client'; //")) {
        conteudo = conteudo.replace(/["']use client["'];\s*\/\/.*/, '"use client";\n');
        fs.writeFileSync(full, conteudo, 'utf8');
        console.log('Corrigido:', full);
      }
    }
  }
}

varrer('./app');
console.log('✅ Pronto! Agora fecha e abre o VSCode');