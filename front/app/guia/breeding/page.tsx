'use client' // 1. Client - usa history.back()

export default function BreedingInterno() {
  return (
    <div className="w-full h-screen bg-[#0f172a] flex flex-col"> {/* 2. Tela cheia - h-screen pra iframe ocupar resto */}
      {/* 3. Header fake WhatsApp - pra parecer nativo da sua loja */}
      <div className="bg-[#008069] p-4 text-white flex items-center gap-3"> {/* 4. Verde zap */}
        <button onClick={() => history.back()} className="text-xl">←</button> {/* 5. Voltar - history API */}
        <div>
          <h1 className="font-bold leading-none">Calculadora de Breeding</h1>
          <p className="text-[11px] opacity-80">Dados do 1.0 - Interno</p>
        </div>
      </div>

      {/* 6. Aviso */}
      <div className="bg-yellow-500/10 text-yellow-300 text-[11px] p-2 text-center">
        Carregando calculadora oficial de forma interna, sem sair da sua loja
      </div>

      {/* 7. O TRUQUE: iframe ocupando tudo - embed externo */}
      <iframe
        src="https://palworld.gg/breeding-calculator" // 8. Site que você está embedando
        className="w-full flex-1 border-0" // 9. flex-1 = ocupa todo resto da tela
        // 10. sandbox deixa rodar JS/forms mas sem allow-top-navigation = não consegue te tirar da página / redirecionar
        sandbox="allow-scripts allow-same-origin allow-forms"
        loading="lazy" // 11. Só carrega quando aparece
        title="Breeding Calculator"
      />
    </div>
  )
}