"use client";

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from './components/Header';
import Footer from './components/Footer';
import { supabase } from '@/lib/supabaseClient'; // 1. CLIENT SUPABASE - SUBSTITUI O JAVA

export default function Page() {
  const router = useRouter();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [loginLiberado, setLoginLiberado] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginSenha, setLoginSenha] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [registerLiberado, setRegisterLiberado] = useState(false);
  const [registerForm, setRegisterForm] = useState({ nome: '', cpf: '', email: '', senha: '', confirma: '', termos: false, privacidade: false });
  const [registerLoading, setRegisterLoading] = useState(false);

  // 2. ATUALIZADO: LOGIN AGORA É 100% SUPABASE - NÃO PRECISA MAIS DO localhost:8081
  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoginLoading(true);
    const email = loginEmail.toLowerCase().trim();

    try {
      // 3. ATUALIZADO: Autentica direto no Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password: loginSenha,
      });
      if (authError) throw new Error(authError.message);

      // 4. ATUALIZADO: Busca perfil na tabela public.clientes
      let { data: cliente, error: cliError } = await supabase
      .from("clientes")
      .select("*")
      .eq("id", authData.user.id)
      .single();

      // 5. NOVO: Se logou no Auth mas não tem linha em 'clientes' (usuário antigo), cria automaticamente
      if (cliError ||!cliente) {
        console.log("Usuário sem perfil, criando agora...");
        const nomeFix = authData.user.user_metadata?.nome || email.split('@')[0];
        const novoCliente = {
          id: authData.user.id,
          nome: nomeFix,
          email: email,
          cpf: "00000000000",
          role: "CLIENTE",
          status: "ATIVO"
        };

        const { data: criado, error: errCriar } = await supabase
        .from("clientes")
        .insert([novoCliente])
        .select()
        .single();

        if (errCriar) throw new Error("Logou mas não criou perfil: " + errCriar.message);
        cliente = criado;
      }

      // 6. MANTIDO: Regra de reativação INATIVO/ESPORADICO -> ATIVO
      if (cliente.status === "INATIVO" || cliente.status === "ESPORADICO") {
        await supabase.from("clientes").update({ status: "ATIVO" }).eq("id", cliente.id);
        cliente.status = "ATIVO";
      }

      // 7. MANTIDO: Salva no localStorage igual antes
      localStorage.setItem("cliente", JSON.stringify(cliente));
      localStorage.setItem("cliente_id", String(cliente.id));

      setIsLoginOpen(false);

      // 8. CORRIGIDO: Agora CLIENTE vai pra /home (ComunidadeClt) e ADMIN pra /admin - você pediu pra não ir pro catalogo direto
      if (cliente.role === "ADMIN" || cliente.role === "ROLE_ADMIN") {
        router.push('/admin');
      } else {
        router.push('/home'); // 9. NOVO: cliente comum vai pra home onde tem o chatbox e guia
      }

    } catch (err: any) {
      alert('Falhou: ' + err.message);
    } finally {
      setLoginLoading(false);
    }
  };

  // 10. ATUALIZADO: REGISTRO AGORA É 100% SUPABASE
  const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!registerForm.termos) return alert('Você precisa aceitar os Termos de Uso');
    if (!registerForm.privacidade) return alert('Você precisa aceitar a Política de Privacidade');
    if (registerForm.senha!== registerForm.confirma) return alert('Senhas diferentes');
    if (registerForm.senha.length < 6) return alert('Senha mínimo 6 caracteres');
    setRegisterLoading(true);
    const email = registerForm.email.toLowerCase().trim();
    const cpfLimpo = registerForm.cpf? registerForm.cpf.replace(/\D/g, "") : "00000000000";

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: registerForm.senha,
        options: { data: { nome: registerForm.nome } }
      });
      if (error) throw error;
      if (!data.user) throw new Error("Não criou usuário");

      const { error: insertError } = await supabase.from("clientes").insert([{
        id: data.user.id,
        nome: registerForm.nome,
        cpf: cpfLimpo,
        email: email,
        role: "CLIENTE",
        status: "ATIVO"
      }]);

      if (insertError) throw insertError;

      alert('Conta criada! Pode logar.');
      setIsRegisterOpen(false);
      setIsLoginOpen(true);

    } catch (err: any) {
      alert('Erro: ' + err.message);
    } finally {
      setRegisterLoading(false);
    }
  };

  return (
    <>
      <style jsx global>{`
        :root { --bg-light: #0B1325; --bg-sand: rgba(17, 28, 53, 0.85); --card-bg: rgba(22, 35, 66, 0.85); --accent-sand: #E2C9A1; --accent-gold: #C5A059; --text-dark: #FAF9F6; --text-muted: #D3C9BF; --white: #FFFFFF; --font-main: 'Segoe UI', sans-serif; }
                * { margin: 0; padding: 0; box-sizing: border-box; } body { font-family: var(--font-main); background-color: var(--bg-light); background-image: linear-gradient(rgba(11, 19, 37, 0.88), rgba(11, 19, 37, 0.92)), url('/palworld-bg.jpg'); background-size: cover; background-position: center; background-attachment: fixed; color: var(--text-dark); line-height: 1.6; } html { scroll-behavior: smooth; }
        header { background-color: rgba(11, 19, 37, 0.9); backdrop-filter: blur(12px); position: sticky; top: 0; z-index: 100; border-bottom: 1px solid rgba(226, 201, 161, 0.15); }
   .nav-container { max-width: 1200px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; padding: 1rem 2rem; }
   .logo { display: flex; align-items: center; gap: 0.85rem; text-decoration: none; color: var(--text-dark); }
   .logo-symbol { width: 44px; height: 44px; position: relative; perspective: 1000px; display: flex; align-items: center; justify-content: center; }
   .capture-sphere { width: 26px; height: 26px; border-radius: 50%; background: radial-gradient(circle at 30% 30%, #FFFFFF, var(--accent-sand), var(--accent-gold)); box-shadow: inset -1px -1px 4px rgba(0,0,0,0.4), 0 0 14px rgba(226, 201, 161, 0.4); animation: rotateSphere 8s linear infinite; }
   .capture-ring { position: absolute; width: 38px; height: 38px; border: 1.5px solid var(--accent-sand); border-radius: 50%; border-top-color: transparent; animation: capturePulse 2s ease-in-out infinite alternate; }
        @keyframes rotateSphere { 0% { transform: rotateY(0deg) rotateX(10deg); } 100% { transform: rotateY(360deg) rotateX(10deg); } } @keyframes capturePulse { 0% { transform: scale(0.9) rotate(0deg); opacity: 0.3; } 100% { transform: scale(1.15) rotate(180deg); opacity: 0.9; } }
   .logo-text-wrapper { display: flex; flex-direction: column; }.logo-title { font-size: 1.35rem; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase; line-height: 1; }.logo-subtitle { font-size: 0.65rem; letter-spacing: 0.25em; text-transform: uppercase; color: var(--accent-sand); font-weight: 600; margin-top: 2px; }
   .auth-actions { display: flex; align-items: center; gap: 1rem; }.btn-link { color: var(--text-dark); text-decoration: none; font-weight: 600; font-size: 0.95rem; padding: 0.6rem 1rem; transition: color 0.2s ease; background: none; border: none; cursor: pointer; }.btn-link:hover { color: var(--accent-sand); }
   .btn { display: inline-block; padding: 0.75rem 1.5rem; border-radius: 50px; text-decoration: none; font-weight: 600; font-size: 0.95rem; transition: all 0.3s ease; cursor: pointer; border: none; }.btn-primary { background-color: var(--accent-sand); color: #0B1325; box-shadow: 0 4px 15px rgba(226, 201, 161, 0.2); }.btn-primary:hover { background-color: var(--white); transform: translateY(-1px); }
   .hero { max-width: 1200px; margin: 0 auto; padding: 6rem 2rem; display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: center; }.hero-content h1 { font-size: 3.25rem; line-height: 1.15; margin-bottom: 1.5rem; }.hero-content p { font-size: 1.15rem; color: var(--text-muted); margin-bottom: 2.5rem; }.hero-card { background-image: linear-gradient(rgba(11, 19, 37, 0.75), rgba(11, 19, 37, 0.85)), url('/card-bg.gif'); background-size: cover; backdrop-filter: blur(8px); border-radius: 28px; padding: 3.5rem; border: 1px solid rgba(226, 201, 161, 0.3); }
   .features { background-color: var(--bg-sand); backdrop-filter: blur(10px); padding: 6rem 2rem; }.section-title { text-align: center; font-size: 2.25rem; margin-bottom: 3.5rem; }.grid-features { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; }.feature-card { backdrop-filter: blur(8px); padding: 2.5rem; border-radius: 20px; border: 1px solid rgba(226, 201, 161, 0.2); }.feature-card-1 { background-image: linear-gradient(rgba(11, 19, 37, 0.8), rgba(11, 19, 37, 0.9)), url('/feature-1.gif'); background-size: cover; }.feature-card-2 { background-image: linear-gradient(rgba(11, 19, 37, 0.8), rgba(11, 19, 37, 0.9)), url('/feature-2.gif'); background-size: cover; }.feature-card-3 { background-image: linear-gradient(rgba(11, 19, 37, 0.8), rgba(11, 19, 37, 0.9)), url('/feature-3.gif'); background-size: cover; }
   .about { max-width: 820px; margin: 0 auto; padding: 6rem 2rem; text-align: center; } footer { background-color: rgba(11, 19, 37, 0.95); color: var(--text-muted); text-align: center; padding: 2.5rem 2rem; border-top: 1px solid rgba(226, 201, 161, 0.1); }
   .modal-overlay { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background-color: rgba(11, 19, 37, 0.85); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; z-index: 1000; }.modal-close { position: absolute; top: 1rem; right: 1rem; background: transparent; border: none; color: var(--accent-sand); font-size: 1.5rem; cursor: pointer; }.modal-form { display: flex; flex-direction: column; gap: 1rem; margin-top: 1rem; }.form-group { display: flex; flex-direction: column; gap: 0.3rem; }.form-group label { font-size: 0.85rem; color: var(--text-muted); }.form-group input { background-color: #0B1325; border: 1px solid rgba(226, 201, 161, 0.2); border-radius: 8px; padding: 0.65rem 0.85rem; color: var(--text-dark); outline: none; }.bunny-modal-content { position: relative; max-width: 95vw; max-height: 95vh; }.main-container { display: flex; gap: 20px; align-items: center; justify-content: center; flex-wrap: wrap; }.magic-card { display: flex; flex-direction: column; align-items: center; }.arch-frame { width: 280px; height: 380px; border-radius: 140px 140px 20px 20px; border: 2px solid rgba(226, 201, 161, 0.3); overflow: hidden; background: #0c1c33; cursor: pointer; }.bunny-video { width: 100%; height: 100%; object-fit: cover; }.badge-btn { margin-top: 15px; background: var(--accent-sand); color: #0B1325; border: none; padding: 8px 16px; border-radius: 20px; font-weight: bold; cursor: pointer; }.right-panel { width: 320px; }.locked-card,.login-card { background: #162342; border: 1px solid rgba(226, 201, 161, 0.3); border-radius: 20px; padding: 2rem; }
    .terms-group { display: flex; flex-direction: column; gap: 0.7rem; margin-top: 0.3rem; }
    .terms-label { display: flex; gap: 0.6rem; align-items: flex-start; font-size: 0.82rem; cursor: pointer; line-height: 1.35; color: var(--text-muted); }
    .terms-label input[type="checkbox"] { width: 16px; height: 16px; margin-top: 2px; accent-color: var(--accent-sand); cursor: pointer; }
    .terms-link { color: var(--accent-sand); text-decoration: underline; font-weight: 600; }
    .terms-link:hover { color: var(--white); }
      `}</style>

      <Header onLogin={() => setIsLoginOpen(true)} onRegister={() => setIsRegisterOpen(true)} />

      <section className="hero">
        <div className="hero-content">
          <h1>Sua gestão de vendas no Palworld em outro nível.</h1>
          <p>O ecossistema de gestão desenvolvido para jogadores otimizarem tempo, organizarem entregas.</p>
          <a href="#recursos" className="btn btn-primary">Conheça a Plataforma</a>
        </div>
        <div className="hero-card"><h3>Agenda Inteligente de Vendas</h3><p>Acompanhe seus pedidos e entregas in-game em tempo real.</p></div>
      </section>

      <section className="features" id="recursos">
        <div className="features-container">
          <h2 className="section-title">Pensado para o dia a dia do seu negócio no Palworld</h2>
          <div className="grid-features">
            <div className="feature-card feature-card-1"><h3>Gestão de Produtos e Pals</h3><p>Organize seus produtos no painel.</p></div>
            <div className="feature-card feature-card-2"><h3>Controle de Pedidos</h3><p>Histórico de compras e clientes.</p></div>
            <div className="feature-card feature-card-3"><h3>Agenda de Serviços</h3><p>Gerencie datas e horários de entregas.</p></div>
          </div>
        </div>
      </section>

      <Footer />

      {isLoginOpen && (
        <div className="modal-overlay" onClick={() => setIsLoginOpen(false)}>
          <div className="bunny-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setIsLoginOpen(false)}>&times;</button>
            <div className="main-container">
              <div className="magic-card">
                <div className="arch-frame" onClick={() => setLoginLiberado(true)}><video autoPlay loop muted playsInline className="bunny-video"><source src="/bunny-hat.mp4" type="video/mp4" /></video></div>
                {!loginLiberado && (<button className="badge-btn" onClick={() => setLoginLiberado(true)}>CLIQUE PARA LOGAR 👆</button>)}
              </div>
              <div className="right-panel">
                {!loginLiberado? (<div className="locked-card"><h2>Fazer Login</h2><p>🔒 Clique na coelhinha</p></div>) : (
                  <div className="login-card">
                    <h2>Bem-vindo</h2><form onSubmit={handleLogin} className="modal-form">
                      <div className="form-group"><label>E-mail</label><input type="text" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} required /></div>
                      <div className="form-group"><label>Senha</label><input type="password" value={loginSenha} onChange={(e) => setLoginSenha(e.target.value)} required /></div>
                      <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loginLoading}>{loginLoading? 'ENTRANDO...' : 'ENTRAR'}</button>
                      <Link href="/esqueci" onClick={() => setIsLoginOpen(false)} style={{color: 'var(--accent-sand)', fontSize: '0.8rem', textAlign: 'right', display: 'block', textDecoration: 'none'}}>Esqueceu sua senha?</Link>
                      <a href="#" onClick={(e) => { e.preventDefault(); setIsLoginOpen(false); setIsRegisterOpen(true); }} style={{color: 'var(--accent-sand)', fontSize: '0.8rem', marginTop: '10px', display: 'block'}}>Não tem conta? Cadastre-se</a>
                    </form>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      {isRegisterOpen && (
        <div className="modal-overlay" onClick={() => setIsRegisterOpen(false)}>
          <div className="bunny-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setIsRegisterOpen(false)}>&times;</button>
            <div className="main-container">
              <div className="magic-card">
                <div className="arch-frame" onClick={() => setRegisterLiberado(true)}><video autoPlay loop muted playsInline className="bunny-video"><source src="/bunny-hat.mp4" type="video/mp4" /></video></div>
                {!registerLiberado && (<button className="badge-btn" onClick={() => setRegisterLiberado(true)}>CLIQUE PARA CRIAR CONTA 👆</button>)}
              </div>
              <div className="right-panel">
                {!registerLiberado? (<div className="locked-card"><h2>Criar Conta</h2><p>🔒 Clique na coelhinha</p></div>) : (
                  <div className="login-card">
                    <h2>Criar conta</h2><form onSubmit={handleRegister} className="modal-form">
                      <div className="form-group"><label>Nome</label><input type="text" value={registerForm.nome} onChange={(e) => setRegisterForm({...registerForm, nome: e.target.value })} required /></div>
                      <div className="form-group"><label>CPF</label><input type="text" value={registerForm.cpf} onChange={(e) => setRegisterForm({...registerForm, cpf: e.target.value })} placeholder="000.000.000-00" /></div>
                      <div className="form-group"><label>E-mail</label><input type="email" value={registerForm.email} onChange={(e) => setRegisterForm({...registerForm, email: e.target.value })} required /></div>
                      <div className="form-group"><label>Senha</label><input type="password" value={registerForm.senha} onChange={(e) => setRegisterForm({...registerForm, senha: e.target.value })} required /></div>
                      <div className="form-group"><label>Confirma Senha</label><input type="password" value={registerForm.confirma} onChange={(e) => setRegisterForm({...registerForm, confirma: e.target.value })} required /></div>

                      <div className="terms-group">
                        <label className="terms-label">
                          <input type="checkbox" checked={registerForm.termos} onChange={(e) => setRegisterForm({...registerForm, termos: e.target.checked })} required />
                          <span>Eu li e aceito os <Link href="/termos" target="_blank" className="terms-link">Termos de Uso</Link></span>
                        </label>
                        <label className="terms-label">
                          <input type="checkbox" checked={registerForm.privacidade} onChange={(e) => setRegisterForm({...registerForm, privacidade: e.target.checked })} required />
                          <span>Eu li e aceito a <Link href="/privacidade" target="_blank" className="terms-link">Política de Privacidade</Link></span>
                        </label>
                      </div>

                      <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={registerLoading ||!registerForm.termos ||!registerForm.privacidade}>{registerLoading? 'CRIANDO...' : 'CRIAR CONTA'}</button>
                    </form>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}