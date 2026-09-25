"use client";


import "./style.css"; // 2. Importa seu CSS da página
import { useState } from "react"; // 3. Memória da tela
import { useRouter } from "next/navigation"; // 4. Pra router.push("/login")
import { authClient } from "../login/types/cliente"; // 5. Seu cliente que chama /api/auth/register
import Link from "next/link"; // 6. Link pra /privacidade e /termos

export default function RegisterPage(){ // 7. Rota /register
  const [liberado,setLiberado] = useState(false); // 8. Coelhinha trava o cadastro - só libera quando clica no vídeo
  const [form,setForm] = useState({nome:"",email:"",senha:"",confirma:""}); // 9. Guarda tudo do form em um objeto só
  const [loading,setLoading] = useState(false); // 10. Trava botão enquanto cria conta
  const [aceitouPrivacidade,setAceitouPrivacidade]=useState(false); // 11. Checkbox 1 obrigatório Play Store
  const [aceitouTermos,setAceitouTermos]=useState(false); // 12. Checkbox 2 obrigatório Play Store
  const router = useRouter(); // 13. Roteador

  const podeCadastrar = aceitouPrivacidade && aceitouTermos; // 14. Só pode cadastrar se aceitou os 2

  async function handleRegister(e:any){ // 15. FUNÇÃO PRINCIPAL DE CADASTRO
    e.preventDefault(); // 16. Impede F5
    if(!podeCadastrar) return alert("Você precisa aceitar a Política e os Termos"); // 17. Valida LGPD
    if(form.senha !== form.confirma) return alert("Senhas diferentes"); // 18. Valida confirmação
    if(form.senha.length < 6) return alert("Senha mínimo 6 caracteres"); // 19. Regra mínima Supabase
    setLoading(true); // 20. Liga loading
    try{
      await authClient.register({ // 21. Chama sua API /api/auth/register que repassa pro Supabase
        name: form.nome, 
        email: form.email.toLowerCase().trim(), // 22. evita duplicata Teste@ e teste@ - normaliza
        password: form.senha,
        // 23. PROVA DE CONSENTIMENTO LGPD - vai pro auth.users.user_metadata do Supabase
        options: {
          data: {
            consent_privacidade: true, // 24. Prova que aceitou privacidade
            consent_termos: true, // 25. Prova que aceitou termos
            consent_data: new Date().toISOString(), // 26. Data/hora do aceite (exigência LGPD)
            finalidade: "manutencao_servidor_palworld" // 27. Finalidade do tratamento de dados
          }
        }
      } as any); // 28. as any porque seu tipo RegisterRequest não tem options, mas precisa mandar
      
      alert("Conta criada!"); 
      router.push("/login"); // 29. Sucesso -> manda pro login
    }catch(err:any){ 
      // 30. TRAVA 1 E-MAIL = 1 CONTA - trata erro de duplicado
      if(err.message.includes("already registered") || err.message.includes("already exists")){
        alert("Este e-mail já está cadastrado."); // 31. Mensagem amigável pra duplicado
      } else {
        alert(err.message); // 32. Outros erros
      }
    }
    finally{ setLoading(false); } // 33. Desliga loading sempre
  }

  return(
    // 34. JSX - Visual
    <div className="page">
      <h1>moto<span>track</span></h1>
      <div className="stage">
        {/* 35. ÁREA DA COELHINHA - clica pra liberar */}
        <div className="magic-area" onClick={()=>setLiberado(true)} style={{cursor:"pointer"}}>
          <div className="character-wrap">
            <video src="/bunny-hat.mp4" autoPlay loop muted playsInline className="bunny-video" />
          </div>
          <div className="floor-glow"></div>
          {!liberado && <p style={{position:'absolute', bottom:25, color:'#39df82', fontWeight:'900', background:'rgba(0,0,0,0.5)', padding:'6px 12px', borderRadius:20}}>CLIQUE PARA CRIAR CONTA 👆</p>}
        </div>
        <div className="login-area">
          <div className="login-card">
            <h2>Criar conta</h2>
            {/* 36. Se não clicou na coelha, mostra bloqueado */}
            {!liberado ? <p>🔒 Clique na coelhinha para liberar o cadastro</p> : (
              <form onSubmit={handleRegister}>
                {/* 37. Inputs controlados pelo objeto form */}
                <label>Nome</label><input value={form.nome} onChange={e=>setForm({...form,nome:e.target.value})} required />
                <label>E-mail</label><input type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} required />
                <label>Senha</label><input type="password" value={form.senha} onChange={e=>setForm({...form,senha:e.target.value})} required />
                <label>Confirma Senha</label><input type="password" value={form.confirma} onChange={e=>setForm({...form,confirma:e.target.value})} required />

                {/* 38. 2 CHECKBOX OBRIGATÓRIOS PLAY STORE - LGPD */}
                <label style={{display:'flex', gap:8, alignItems:'flex-start', fontSize:13, marginTop:10, cursor:'pointer'}}>
                  <input type="checkbox" checked={aceitouPrivacidade} onChange={e=>setAceitouPrivacidade(e.target.checked)} />
                  <span>Li e aceito a <Link href="/privacidade" target="_blank" style={{color:'#39df82', textDecoration:'underline'}}>Política de Privacidade</Link></span>
                </label>

                <label style={{display:'flex', gap:8, alignItems:'flex-start', fontSize:13, cursor:'pointer'}}>
                  <input type="checkbox" checked={aceitouTermos} onChange={e=>setAceitouTermos(e.target.checked)} />
                  <span>Li e aceito os <Link href="/termos" target="_blank" style={{color:'#39df82', textDecoration:'underline'}}>Termos de Uso</Link> e que a renda mantém o servidor privado de Palworld</span>
                </label>

                {/* 39. Botão só habilita se marcou os 2 checkbox + não tá em loading */}
                <button className="enter" disabled={loading || !podeCadastrar} style={{opacity: !podeCadastrar ? 0.4 : 1}}>{loading?"CRIANDO...":"CRIAR CONTA"}</button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}