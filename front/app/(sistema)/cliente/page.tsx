"use client";


import { useEffect, useState, FormEvent } from "react"; // 2. Hooks do React - useState guarda dado, useEffect roda ao abrir, FormEvent tipa o submit
import { clienteClient } from "./types/cliente"; // 3. Nosso cliente que fala com a API - list(), create(), remove()
import { ClienteResponse, EnumStatusCliente } from "./types/schema"; // 4. Tipos - response pra lista, enum pro status

export default function ClientePage(){ // 5. Tela /cliente
  // 6. Lista de clientes que vem do banco - começa vazio []
  const [clientes, setClientes] = useState<ClienteResponse[]>([]);
  
  // 7. Formulário controlado - guarda o que você digita - um objeto só com tudo
  const [form, setForm] = useState({ nome: "", cpf: "", email: "", senha: "", status: EnumStatusCliente.ATIVO });

  // 8. Função que carrega clientes do banco - GET /api/clientes -> Java
  async function carregar(){ setClientes(await clienteClient.list()); }
  
  // 9. Quando abre a tela, carrega a lista automaticamente - [] no final = roda só 1x
  useEffect(() => { carregar(); }, []);

  // 10. Quando clica em CADASTRAR
  async function handleCreate(e: FormEvent){
    e.preventDefault(); // 11. Não recarrega a página - comportamento padrão do form é recarregar
    try{
      await clienteClient.create(form); // 12. Manda pro Java salvar - POST /api/clientes
      setForm({ nome:"", cpf:"", email:"", senha:"", status: EnumStatusCliente.ATIVO }); // 13. Limpa form - volta pro inicial
      carregar(); // 14. Atualiza a lista - busca de novo do banco pra mostrar o novo cliente
    }catch(err){ alert((err as Error).message) } // 15. Se Java deu erro (CPF duplicado, etc), mostra alerta
  }

  return (
    <div>
      {/* 16. Seu JSX do form e tabela aqui - me manda print do resto que eu completo */}
    </div>
  )
}