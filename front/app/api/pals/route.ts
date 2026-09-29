// 1. Força dinâmico - sem cache estático
export const dynamic = "force-dynamic";
// 2. Precisa Node pra usar fs/path
export const runtime = "nodejs";

import { NextResponse } from "next/server"; // 3. Resposta json
import fs from "fs"; // 4. Ler pastas
import path from "path"; // 5. Montar caminho

// 6. Tipo cru do pals.json remoto
type RemotePal = {
  name: string;
  combiRank: number;
  combiPriority?: number;
  breedable?: boolean;
  uniqueOnly?: boolean;
  paldex?: number;
  icon?: string;
  suffix?: string;
};

// 7. Combinação fixa - pais definidos geram filho específico
type RemoteUniqueCombo = {
  parents: [string, string];
  child: string;
  ga?: string;
  gb?: string;
};

// 8. Formato do arquivo pals.json
type RemoteData = {
  dataVersion?: string;
  generatedAt?: string;
  pals: RemotePal[];
  uniqueCombos?: RemoteUniqueCombo[];
};

// 9. Formato que o front vai receber - já tratado
export type PalEntry = {
  name: string;
  key: string; // 10. nome normalizado pra comparar - sem case, sem _male
  fileName: string | null; // 11. PNG local encontrado ou null
  combiRank: number; // 12. rank usado na fórmula de breed
  tieBreak: number; // 13. desempate
  combiPriority: number;
  hasFile: boolean; // 14. tem imagem local?
  paldex?: number;
  suffix?: string;
  breedable: boolean;
  uniqueOnly: boolean; // 15. só nasce de combo único
};

// 16. Normaliza pra achar arquivo: minúsculo, tira extensão, tira t_, tira _m/_f/_male/_female, tira símbolo
function normalizeKey(value: string): string {
  return value
    .toLowerCase()
    .replace(/\.[^/.]+$/, "")
    .replace(/^t_/, "")
    .replace(/_(?:m|f)$/i, "")
    .replace(/_(?:male|female)$/i, "")
    .replace(/[^a-z0-9]/g, "");
}

/**
 * 17. Lê PNGs de public/palicons
 */
function getLocalIcons(): string[] {
  const iconsDirectory = path.join(process.cwd(),"public","palicons"); // 18. caminho absoluto
  if (!fs.existsSync(iconsDirectory)) return []; // 19. se não existe, não quebra
  return fs.readdirSync(iconsDirectory).filter((file) => /\.(png|jpg|jpeg|webp)$/i.test(file)); // 20. só imagens
}

/**
 * 21. Tenta achar PNG local pro Pal do JSON
 */
function findLocalIcon(pal: RemotePal, localIcons: string[]): string | null {
  const possibleNames = [pal.icon ?? "", pal.name]; // 22. tenta pelo icon, depois pelo name
  for (const possibleName of possibleNames) {
    if (!possibleName) continue;
    const key = normalizeKey(path.basename(possibleName)); // 23. normaliza
    const found = localIcons.find((file) => normalizeKey(file) === key); // 24. compara normalizado
    if (found) return found; // 25. achou
  }
  return null; // 26. não tem local
}

// 27. GET /api/pals
export async function GET() {
  try {
    // 28. 1. LOCALIZA JSON - public/data/pals.json
    const dataPath = path.join(process.cwd(),"public","data","pals.json");

    if (!fs.existsSync(dataPath)) { // 29. não tem json
      return NextResponse.json({ error: "O arquivo public/data/pals.json não foi encontrado." }, { status: 404 });
    }

    // 30. 2. LÊ JSON LOCAL
    const fileContent = fs.readFileSync(dataPath,"utf-8");
    const data = JSON.parse(fileContent) as RemoteData; // 31. vira objeto

    // 32. 3. LÊ PNGs
    const localIcons = getLocalIcons();

    // 33. 4. CONVERTE DADOS - filtra e mapeia pro formato do front
    const pals: PalEntry[] = (data.pals ?? [])
        .filter((pal) => { // 34. só rank válido >0 e breedable != false
          return Number.isFinite(pal.combiRank) && pal.combiRank > 0 && pal.breedable !== false;
        })
        .map((pal) => {
          const fileName = findLocalIcon(pal, localIcons); // 35. procura imagem
          const combiPriority = pal.combiPriority ?? pal.combiRank * 100; // 36. fallback prioridade
          return {
            name: pal.name,
            key: normalizeKey(pal.name),
            fileName,
            combiRank: pal.combiRank,
            tieBreak: combiPriority, // 37. usa priority como desempate
            combiPriority,
            hasFile: fileName !== null,
            paldex: pal.paldex,
            suffix: pal.suffix,
            breedable: pal.breedable !== false,
            uniqueOnly: pal.uniqueOnly === true
          };
        })
        .sort((a, b) => a.combiRank - b.combiRank); // 38. ordena por rank - menor primeiro

    // 39. 5. COMBINAÇÕES ESPECIAIS
    const uniqueCombos = data.uniqueCombos ?? [];

    // 40. 6. POOL GENÉRICO - só quem pode cruzar normal e não é uniqueOnly
    const genericPool = pals.filter((pal) => pal.breedable && !pal.uniqueOnly && pal.combiRank > 0);

    // 41. 7. RETORNA PRO FRONT
    return NextResponse.json({
      pals, // 42. lista tratada
      uniqueCombos, // 43. combos fixos
      genericPoolSize: genericPool.length,
      totalFiles: localIcons.length, // 44. total pngs que você tem local
      uniquePals: pals.filter((pal) => pal.uniqueOnly).length,
      dataVersion: data.dataVersion ?? "dados locais",
      generatedAt: data.generatedAt ?? null,
      source: "Dados locais do projeto"
    });
  } catch (error) { // 45. erro geral
    console.error("Erro na API de Pals:", error);
    return NextResponse.json({ error: "Não foi possível carregar os dados dos Pals." }, { status: 500 });
  }
}