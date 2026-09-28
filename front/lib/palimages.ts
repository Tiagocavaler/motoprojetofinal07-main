// front/lib/paliimages.ts - 233 PALS - FINAL
const FILES = [
  "T_Alpaca_icon_normal.png",
  "T_Anubis_icon_normal.png",
  // adiciona os outros 231 aqui depois
];

function cleanName(file: string) {
  return file.replace("T_","").replace("_icon_normal.png","").replace(".png","").toLowerCase();
}

export const PAL_IMAGES: Record<string, string> = {};
FILES.forEach(f => { PAL_IMAGES[cleanName(f)] = `/pals/${f}`; });

export function getPalImage(tipo: string) {
  return PAL_IMAGES[tipo.toLowerCase().trim()] || `/pals/${FILES[0]}`;
}

export const ALL_PALS = FILES.map(f => ({
  key: cleanName(f),
  file: f,
  path: `/pals/${f}`,
  name: cleanName(f).replace(/_/g, " "),
}));