"use client";

import { useEffect, useState, FormEvent } from "react"; // 1. Hooks do React - useState guarda dado, useEffect roda ao abrir, FormEvent tipa o submit
import { ClienteResponse, EnumStatusCliente } from "./types/schema"; // 2. Tipos - response pra lista, enum pro status

export default function ClientePage(){ // 3. Tela /cliente - LISTA E CADASTRA
  // 4. Lista de clientes que vem do banco - começa vazio []
  const [clientes, setClientes] = useState<ClienteResponse[]>([]);
  // 5. Filtro de status - null = todos, ATIVO, ESPORADICO, INATIVO
  const [filtro, setFiltro] = useState<EnumStatusCliente | "TODOS">("TODOS");
  // 6. Loading da lista
  const [loadingLista, setLoadingLista] = useState(false);
  
  // 7. Formulário controlado - guarda o que você digita - um objeto só com tudo
  const [form, setForm] = useState({ nome: "", cpf: "", email: "", senha: "", status: EnumStatusCliente.ATIVO });

  // 8. Função que carrega clientes do banco - GET http://localhost:8081/usuarios?status=...
  async function carregar(){
    setLoadingLista(true); // 9. Liga loading da lista
    try{
      // 10. Monta URL com filtro - se TODOS não manda query param
      let url = "http://localhost:8081/usuarios"; // 11. URL base do seu Java
      if(filtro !== "TODOS"){ // 12. Se selecionou um status
        url += `?status=${filtro}`; // 13. Adiciona ?status=ATIVO etc - seu controller novo já aceita
      }
      const res = await fetch(url); // 14. Busca do Java
      const data = await res.json(); // 15. Converte
      setClientes(data); // 16. Guarda na lista pra renderizar
    } catch(err){
      console.error(err); // 17. Loga erro no console
    }
    setLoadingLista(false); // 18. Desliga loading
  }
  
  // 19. Quando abre a tela ou quando muda o filtro, carrega a lista automaticamente
  useEffect(() => { carregar(); }, [filtro]); // 20. [filtro] = roda toda vez que filtro muda

  // 21. Quando clica em CADASTRAR
  async function handleCreate(e: FormEvent){
    e.preventDefault(); // 22. Não recarrega a página - comportamento padrão do form é recarregar
    try{
      // 23. Manda pro Java salvar - POST http://localhost:8081/usuarios - seu ClienteController.criar
      const res = await fetch("http://localhost:8081/usuarios", {
        method: "POST", // 24. Criar
        headers: {"Content-Type":"application/json"}, // 25. JSON
        body: JSON.stringify({ // 26. Corpo que seu ClienteRequestDTO espera
          nome: form.nome, // 27. Nome
          cpf: form.cpf.replace(/\D/g,""), // 28. CPF só números
          email: form.email, // 29. Email
          senha: form.senha // 30. Senha - Java criptografa com BCrypt
          // 31. Status não precisa mandar - Java já cria como ATIVO automaticamente no seu service
        })
      });
      if(!res.ok){ // 32. Se deu erro
        const erro = await res.json(); // 33. Pega mensagem
        throw new Error(erro.message || "Erro ao cadastrar"); // 34. Lança
      }
      setForm({ nome:"", cpf:"", email:"", senha:"", status: EnumStatusCliente.ATIVO }); // 35. Limpa form - volta pro inicial
      setFiltro("TODOS"); // 36. Volta filtro pra TODOS pra ver o novo
      carregar(); // 37. Atualiza a lista - busca de novo do banco
    }catch(err){ alert((err as Error).message) } // 38. Se Java deu erro (CPF duplicado, etc), mostra alerta
  }

  // 39. Função pra cor do badge do status - visual
  function corStatus(s: string){
    if(s === "ATIVO") return "bg-green-500/20 text-green-400 border-green-500/30"; // 40. Verde pra ativo
    if(s === "ESPORADICO") return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"; // 41. Amarelo pra esporadico
    if(s === "INATIVO") return "bg-red-500/20 text-red-400 border-red-500/30"; // 42. Vermelho pra inativo
    return "bg-zinc-500/20 text-zinc-400"; // 43. Cinza pra excluido
  }

  return (
    <div className="p-8 bg-[#0B1325] min-h-screen text-white"> {/* 44. Container da página */}
      <h1 className="text-2xl font-black">Clientes - MotoTrack</h1> {/* 45. Titulo */}

      {/* 46. FILTROS DE STATUS - ATIVO/ESPORADICO/INATIVO - consome seu ?status= do Java */}
      <div className="flex gap-2 mt-6">
        {["TODOS", "ATIVO", "ESPORADICO", "INATIVO", "EXCLUIDO"].map((st) => (
          <button
            key={st}
            onClick={()=>setFiltro(st as any)} // 47. Ao clicar muda filtro e useEffect recarrega
            className={`px-4 py-2 rounded-xl text-xs font-bold border transition ${filtro === st ? "bg-[#E2C9A1] text-black border-[#E2C9A1]" : "bg-[#162342] text-zinc-400 border-white/10 hover:text-white"}`}
          >
            {st}
          </button>
        ))}
      </div>

      {/* 48. FORM CADASTRO */}
      <form onSubmit={handleCreate} className="mt-8 max-w-2xl bg-[#162342] p-6 rounded-2xl border border-white/10 grid grid-cols-2 gap-4">
        <input placeholder="Nome" value={form.nome} onChange={e=>setForm({...form, nome:e.target.value})} className="p-3 rounded-xl bg-black/30 border border-white/10 col-span-2" required />
        <input placeholder="CPF" value={form.cpf} onChange={e=>setForm({...form, cpf:e.target.value})} className="p-3 rounded-xl bg-black/30 border border-white/10" required />
        <input placeholder="Email" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} className="p-3 rounded-xl bg-black/30 border border-white/10" required />
        <input placeholder="Senha" type="password" value={form.senha} onChange={e=>setForm({...form, senha:e.target.value})} className="p-3 rounded-xl bg-black/30 border border-white/10 col-span-2" required />
        <button className="col-span-2 bg-[#E2C9A1] text-black py-3 rounded-xl font-black">CADASTRAR (VIRA ATIVO)</button>
      </form>

      {/* 49. TABELA DE CLIENTES */}
      <div className="mt-8 bg-[#162342] rounded-2xl border border-white/10 overflow-hidden">
        {loadingLista ? <p className="p-6">Carregando...</p> : (
          <table className="w-full text-sm">
            <thead className="bg-black/30 text-zinc-400 text-xs">
              <tr><th className="p-3 text-left">Nome</th><th className="p-3 text-left">Email</th><th className="p-3 text-left">Status</th><th className="p-3 text-left">Último Acesso</th></tr>
            </thead>
            <tbody>
              {clientes.map((c:any)=>(
                <tr key={c.id} className="border-t border-white/5">
                  <td className="p-3">{c.nome}</td>
                  <td className="p-3 text-zinc-400">{c.email}</td>
                  <td className="p-3"><span className={`px-2 py-1 rounded-full text-[10px] font-black border ${corStatus(c.status)}`}>{c.status}</span></td>
                  <td className="p-3 text-zinc-400">{c.ultimoAcesso ? new Date(c.ultimoAcesso).toLocaleDateString() : "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {clientes.length === 0 && !loadingLista && <p className="p-6 text-center text-zinc-500">Nenhum cliente com esse filtro. Cadastra um!</p>}
      </div>
    </div>
  )
}