"use client";

import "./style.css"; // 1. Importa seu CSS da página
import { useState } from "react"; // 2. Memória da tela
import { useRouter } from "next/navigation"; // 3. Pra router.push("/login")
import Link from "next/link"; // 4. Link pra /privacidade e /termos

export default function RegisterPage(){ // 5. Rota /register
  const [liberado,setLiberado] = useState(false); // 6. Coelhinha trava o cadastro - só libera quando clica no vídeo
  const [form,setForm] = useState({nome:"",cpf:"",email:"",senha:"",confirma:""}); // 7. Guarda tudo do form em um objeto só - agora com cpf
  const [loading,setLoading] = useState(false); // 8. Trava botão enquanto cria conta
  const [aceitouPrivacidade,setAceitouPrivacidade]=useState(false); // 9. Checkbox 1 obrigatório Play Store - LGPD
  const [aceitouTermos,setAceitouTermos]=useState(false); // 10. Checkbox 2 obrigatório Play Store - LGPD
  const router = useRouter(); // 11. Roteador

  const podeCadastrar = aceitouPrivacidade && aceitouTermos; // 12. Só pode cadastrar se aceitou os 2 - regra Play Store

  async function handleRegister(e:any){ // 13. FUNÇÃO PRINCIPAL DE CADASTRO - AGORA CHAMA SEU BACK JAVA
    e.preventDefault(); // 14. Impede F5 da página
    if(!podeCadastrar) return alert("Você precisa aceitar a Política e os Termos"); // 15. Valida LGPD antes de mandar
    if(form.senha !== form.confirma) return alert("Senhas diferentes"); // 16. Valida confirmação de senha
    if(form.senha.length < 6) return alert("Senha mínimo 6 caracteres"); // 17. Regra mínima do seu PasswordEncoder
    if(form.cpf.length < 11) return alert("CPF inválido"); // 18. Validação simples de CPF
    setLoading(true); // 19. Liga loading pra travar duplo clique
    try{
      // 20. CHAMA SEU BACK SPRING BOOT NA PORTA 8081 - rota /usuarios
      const res = await fetch("http://localhost:8081/usuarios", {
        method: "POST", // 21. Método criar
        headers: { "Content-Type": "application/json" }, // 22. Diz que é JSON
        body: JSON.stringify({ // 23. Corpo que seu ClienteRequestDTO espera
          nome: form.nome, // 24. Nome pro banco Postgres
          cpf: form.cpf.replace(/\D/g, ""), // 25. Limpa máscara do CPF - só números
          email: form.email.toLowerCase().trim(), // 26. Normaliza e-mail pra evitar duplicata Teste@ e teste@
          senha: form.senha, // 27. Senha crua - seu back já criptografa com BCrypt
        })
      });

      // 28. Pega resposta do Java
      const data = await res.json(); // 29. Transforma em objeto

      if(!res.ok){ // 30. Se deu erro 400/500
        // 31. TRATAMENTO DE DUPLICIDADE - seu service lança "Email já cadastrado"
        throw new Error(data.message || "Erro ao cadastrar");
      }

      // 32. SUCESSO - cliente criado com status ATIVO automaticamente no Java
      // 33. PROVA DE CONSENTIMENTO LGPD - salva no localStorage pra mandar depois no perfil
      localStorage.setItem("lgpd_consent", JSON.stringify({ // 34. Guarda prova local
        consent_privacidade: true, // 35. Prova que aceitou privacidade
        consent_termos: true, // 36. Prova que aceitou termos
        consent_data: new Date().toISOString(), // 37. Data/hora do aceite - exigência LGPD
        finalidade: "manutencao_servidor_palworld", // 38. Finalidade do tratamento
        cliente_id: data.id, // 39. Vincula consentimento ao ID criado no Postgres
        status_inicial: data.status // 40. Vai vir ATIVO - prova que seu EnumStatusCliente funcionou
      }));
      
      alert(`Conta criada! Status: ${data.status}`); // 41. Mostra que já é ATIVO
      router.push("/login"); // 42. Manda pro login
    }catch(err:any){ 
      // 43. TRAVA 1 E-MAIL = 1 CONTA - trata erro de duplicado
      if(err.message.includes("Email já cadastrado") || err.message.includes("already exists")){
        alert("Este e-mail já está cadastrado."); // 44. Mensagem amigável pra duplicado
      } else {
        alert(err.message); // 45. Outros erros do back
      }
    }
    finally{ setLoading(false); } // 46. Desliga loading sempre - sucesso ou erro
  }

  return(
    // 47. JSX - Visual igual ao seu
    <div className="page">
      <h1>moto<span>track</span></h1>
      <div className="stage">
        {/* 48. ÁREA DA COELHINHA - clica pra liberar - gamificação */}
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
            {/* 49. Se não clicou na coelha, mostra bloqueado - trava anti-bot */}
            {!liberado ? <p>🔒 Clique na coelhinha para liberar o cadastro</p> : (
              <form onSubmit={handleRegister}>
                {/* 50. Inputs controlados pelo objeto form - espelho do ClienteRequestDTO */}
                <label>Nome</label><input value={form.nome} onChange={e=>setForm({...form,nome:e.target.value})} required />
                <label>CPF</label><input value={form.cpf} onChange={e=>setForm({...form,cpf:e.target.value})} placeholder="000.000.000-00" required />
                <label>E-mail</label><input type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} required />
                <label>Senha</label><input type="password" value={form.senha} onChange={e=>setForm({...form,senha:e.target.value})} required />
                <label>Confirma Senha</label><input type="password" value={form.confirma} onChange={e=>setForm({...form,confirma:e.target.value})} required />

                {/* 51. 2 CHECKBOX OBRIGATÓRIOS PLAY STORE - LGPD - precisa estar marcado */}
                <label style={{display:'flex', gap:8, alignItems:'flex-start', fontSize:13, marginTop:10, cursor:'pointer'}}>
                  <input type="checkbox" checked={aceitouPrivacidade} onChange={e=>setAceitouPrivacidade(e.target.checked)} />
                  <span>Li e aceito a <Link href="/privacidade" target="_blank" style={{color:'#39df82', textDecoration:'underline'}}>Política de Privacidade</Link></span>
                </label>

                <label style={{display:'flex', gap:8, alignItems:'flex-start', fontSize:13, cursor:'pointer'}}>
                  <input type="checkbox" checked={aceitouTermos} onChange={e=>setAceitouTermos(e.target.checked)} />
                  <span>Li e aceito os <Link href="/termos" target="_blank" style={{color:'#39df82', textDecoration:'underline'}}>Termos de Uso</Link> e que a renda mantém o servidor privado de Palworld</span>
                </label>

                {/* 52. Botão só habilita se marcou os 2 checkbox + não tá em loading + liberado pela coelha */}
                <button className="enter" disabled={loading || !podeCadastrar} style={{opacity: !podeCadastrar ? 0.4 : 1}}>{loading?"CRIANDO...":"CRIAR CONTA"}</button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}