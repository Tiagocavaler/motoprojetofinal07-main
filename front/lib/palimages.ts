// 1. front/lib/palimages.ts - 233 PALS - FINAL - mapeia nome limpo -> arquivo
const FILES = [ // 2. Lista bruta dos pngs
  "T_Alpaca_icon_normal.png","T_Anubis_icon_normal.png"
  // 3. cola o resto dos 233 aqui separado por vírgula quando tiver do bucket
];

function cleanName(file: string) { // 4. T_Alpaca_icon_normal.png -> alpaca
  return file.replace("T_","").replace("_icon_normal.png","").replace(".png","").toLowerCase();
}

export const PAL_IMAGES: Record<string, string> = {}; // 5. Dicionário chave -> /pals/arquivo
FILES.forEach(f => { PAL_IMAGES[cleanName(f)] = `/pals/${f}`; }); // 6. Preenche tudo

export function getPalImage(tipo: string) { // 7. Pega imagem por nome
  if (!tipo) return `/pals/${FILES[0]}`;
  const key = tipo.toLowerCase().trim();
  // se já vier URL completa do bucket do Supabase, retorna direto
  if (key.startsWith("http")) return tipo;
  return PAL_IMAGES[key] || `/pals/${FILES[0]}` || `/pals/T_Alpaca_icon_normal.png`;
}

export const ALL_PALS = FILES.map(f => ({ // 8. Lista pro select/autocomplete
  key: cleanName(f), // 9. ex: blueplatypus_fire
  file: f,
  path: `/pals/${f}`,
  name: cleanName(f).replace(/_/g, " "), // 10. bonito pro usuário
}));