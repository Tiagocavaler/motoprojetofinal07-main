import Link from 'next/link'; // 1. Link next

export default function guia(){ // 2. Rota /guia - deveria ser Guia maiúsculo mas funciona
  return(
    <div style={{minHeight:'100vh', background:'#0a1929', color:'white', padding:24}}> {/* 3. Tela cheia fundo escuro */}
      <h1>Guia</h1>
      <Link href="/guia/breeding" style={{display:'inline-block', marginTop:20, background:'#39df82', color:'#0a1929', padding:'12px 20px', borderRadius:12, textDecoration:'none', fontWeight:700}}> {/* 4. Botão pro /guia/breeding */}
        🧬 Abrir Calculadora de Breeding - 199 Pals
      </Link>
    </div>
  )
}