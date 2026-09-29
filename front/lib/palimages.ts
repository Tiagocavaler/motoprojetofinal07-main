// 1. front/app/lib/palimages.ts - 233 PALS - FINAL - mapeia nome limpo -> arquivo
const FILES = [ // 2. Lista bruta dos pngs que estão em /public/pals/
  "T_Alpaca_icon_normal.png","T_Anubis_icon_normal.png", ... // 3. 233 nomes
];

function cleanName(file: string) { // 4. T_Alpaca_icon_normal.png -> alpaca
  return file.replace("T_","").replace("_icon_normal.png","").replace(".png","").toLowerCase();
}

export const PAL_IMAGES: Record<string, string> = {}; // 5. Dicionário chave -> /pals/arquivo
FILES.forEach(f => { PAL_IMAGES[cleanName(f)] = `/pals/${f}`; }); // 6. Preenche tudo

export function getPalImage(tipo: string) { // 7. Pega imagem por nome - se não achar cai no primeiro (alpaca) como fallback
  return PAL_IMAGES[tipo.toLowerCase().trim()] || `/pals/${FILES[0]}`;
}

export const ALL_PALS = FILES.map(f => ({ // 8. Lista pronta pro select/autocomplete - key/file/path/name legível
  key: cleanName(f), // 9. ex: blueplatypus_fire
  file: f,
  path: `/pals/${f}`,
  name: cleanName(f).replace(/_/g, " "), // 10. blueplatypus fire - bonito pro usuário
}));