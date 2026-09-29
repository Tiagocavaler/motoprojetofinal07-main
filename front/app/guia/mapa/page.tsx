"use client";


export default function MapaPage() { // 2. Rota /mapa
  return (
    <div className="w-full h-[calc(100vh-64px)] bg-[#0b1620] relative overflow-hidden"> {/* 3. Altura total menos header da sua loja (64px) - relative pro absoluto interno - overflow-hidden sem scroll duplo */}

      <iframe
        src="https://palworld.gg/map" // 4. Mapa externo embedado
        className="absolute top-0 left-0 w-full h-full border-0" // 5. Cobre tudo
        style={{ marginTop: '-56px', height: 'calc(100% + 56px)' }} // 6. TRUQUE: sobe 56px pra cortar header do palworld.gg e estica - deixa só o mapa aparecendo
        allowFullScreen
      />

      {/* 7. Sua barra por cima do iframe */}
      <div className="absolute top-0 left-0 w-full h-[56px] bg-[#0b1620] z-10 flex items-center px-4 pointer-events-none"> {/* 8. z-10 fica em cima do iframe - pointer-events-none deixa clique passar pro mapa */}
        <span className="text-white text-sm font-bold pointer-events-auto"> {/* 9. pointer-events-auto volta clique só no texto */}
          Mapa Interativo - Pal Dex
        </span>
      </div>
    </div>
  );
}