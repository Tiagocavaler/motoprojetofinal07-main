"use client";

type Props = { // 2. Props - funções que abrem modais - vem do page.tsx
  onLogin: () => void;
  onRegister: () => void;
}
export default function Header({ onLogin, onRegister }: Props){
  return (
    <header> {/* 3. Topo */}
      <div className="nav-container"> {/* 4. Container pra alinhar logo esq / botões dir */}
        <a href="#" className="logo"> {/* 5. Logo volta pro topo */}
          <div className="logo-symbol"><div className="capture-sphere"></div><div className="capture-ring"></div></div> {/* 6. Ícone esfera - css puro */}
          <div className="logo-text-wrapper"><span className="logo-title">ComunidadeClt</span><span className="logo-subtitle">Palworld</span></div> {/* 7. Título */}
        </a>
        <div className="auth-actions"> {/* 8. Área botões auth */}
          <button className="btn-link" onClick={onLogin}>Entrar</button> {/* 9. Abre modal login */}
          <button className="btn btn-primary" onClick={onRegister}>Criar Conta</button> {/* 10. Abre modal cadastro */}
        </div>
      </div>
    </header>
  );
}