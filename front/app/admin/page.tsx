"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getTodosProdutosAdmin } from "../../lib/api"; // 2. Função que busca tudo do banco - até inativo
import { supabase } from "../../lib/supabaseClient";

// 3. 👇 COLOCA SEU EMAIL DE ADMIN AQUI - IGUAL AO DO /home - proteção simples por email
const EMAIL_ADMIN = "admin@palworld.com";

export default function AdminPage() {
  const router = useRouter();
  const [produtos, setProdutos] = useState<any[]>([]); // 4. 413 Pals já no banco
  const [itensPublic, setItensPublic] = useState<any[]>([]); // 5. Novos arquivos da pasta /public
  const [busca, setBusca] = useState("");
  const [filtro, setFiltro] = useState("todos");
  const [modalItem, setModalItem] = useState<any>(null); // 6. Item que abriu no modal pra editar/listar
  const [preco, setPreco] = useState("99.90");
  const [qtd, setQtd] = useState("10");
  const [modoEdicao, setModoEdicao] = useState(false); // 7. true = editando um do banco, false = liberando um da public
  const [loadingAuth, setLoadingAuth] = useState(true); // 8. Enquanto verifica se é admin

  useEffect(() => {
    const verificarAdmin = async () => { // 9. Proteção da rota /admin
      const { data: { user } } = await supabase.auth.getUser(); // 10. Quem tá logado?
      if (!user || user.email!== EMAIL_ADMIN) { // 11. Se não logou ou não é o email admin
        alert("Acesso negado! Só admin entra aqui."); // 12. Bloqueia
        router.push("/home"); // 13. Manda pra home
        return;
      }
      setLoadingAuth(false); // 14. Passou, pode mostrar página
      carregar(); // 15. Carrega dados
    };
    verificarAdmin();
  }, []);

  const carregar = async () => {
    const p = await getTodosProdutosAdmin(); // 16. Busca todos do banco via sua lib/api - sem filtro ativo_na_loja
    setProdutos(p as any);
    const res = await fetch("/api/itens"); // 17. Busca arquivos da public
    const data = await res.json();
    setItensPublic(Array.isArray(data)? data : []); // 18. Garante array
  };

  const confirmar = async () => { // 19. Botão Salvar/Listar do modal
    if(!modalItem) return;
    if(modoEdicao){ // 20. Editando produto já existente
      await supabase.from("produtos").update({ preco: parseFloat(preco), estoque: parseInt(qtd) }).eq("id", modalItem.id); // 21. UPDATE produtos SET preco, estoque WHERE id
    } else { // 22. Novo vindo da public
      await supabase.from("produtos").insert({ nome: modalItem.nome, imagem: modalItem.arquivo, preco: parseFloat(preco), estoque: parseInt(qtd), ativo_na_loja: true, categoria: modalItem.categoria }); // 23. INSERT com ativo_na_loja true já libera pro catálogo
    }
    setModalItem(null); // 24. Fecha modal
    carregar(); // 25. Recarrega listas
  };

  const filtrar = (lista:any[]) => lista.filter((i:any)=>{ // 26. Função filtro por nome e categoria
    const nome = (i.nome||"").toLowerCase();
    const cat = (i.categoria||"pal").toLowerCase();
    return nome.includes(busca.toLowerCase()) && (filtro==="todos" || cat===filtro);
  });

  if (loadingAuth) { // 27. Tela enquanto verifica admin
    return <div className="min-h-screen bg-[#0B1325] flex items-center justify-center text-white">Verificando permissão...</div>;
  }

  const listaPublic = filtrar(itensPublic.map((x:any)=> ({...x, id: x.arquivo}) )); // 28. Filtra public
  const listaBanco = filtrar(produtos); // 29. Filtra banco
  const jaExiste = (arq:string) => produtos.some((p:any)=> p.imagem===arq); // 30. Evita duplicar - checa se imagem já tá no banco

  return (
    <div className="min-h-screen bg-[#0B1325] p-6 text-white">
      <div className="flex justify-between items-center">
        <p className="font-bold">Banco: {produtos.length} | Public: {itensPublic.length}</p>
        <button onClick={async ()=>{ await supabase.auth.signOut(); router.push("/home"); }} className="bg-white/10 px-4 py-1 rounded-full text-xs">Sair</button>
      </div>

      <input value={busca} onChange={e=>setBusca(e.target.value)} placeholder="Buscar..." className="w-full p-3 mt-4 bg-[#162342] rounded-xl border border-white/10 outline-none" />
      <div className="flex gap-2 mt-4 flex-wrap">
        {['todos','pal','arma','armadura','escudo','municao','esfera'].map(c=>(
          <button key={c} onClick={()=>setFiltro(c)} className={`px-3 py-1 rounded-full text-xs border ${filtro===c?'bg-[#E2C9A1] text-black':'bg-[#162342] border-white/10'}`}>{c.toUpperCase()} ({c==='todos'? listaBanco.length+listaPublic.length : filtrar([...produtos,...itensPublic]).length})</button>
        ))}
      </div>

      <h2 className="mt-8 font-bold text-[#E2C9A1]">BANCO - {listaBanco.length} itens (seus 413 Pals estão aqui)</h2>
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mt-3">
        {listaBanco.map((it:any)=>(
          <div key={it.id} className="bg-[#162342] p-2 rounded-xl border border-white/10">
            <img src={it.imagem} className="h-20 w-full object-contain" />
            <p className="text-[10px] truncate">{it.nome}</p>
            <p className="text-[9px] text-zinc-400">R$ {it.preco} | Qtd {it.estoque}</p>
            <button onClick={()=>{ setModalItem(it); setPreco(String(it.preco)); setQtd(String(it.estoque)); setModoEdicao(true); }} className="w-full mt-1 bg-white/10 py-1 rounded text-[10px]">Editar Valor/Qtd</button>
          </div>
        ))}
      </div>

      <h2 className="mt-8 font-bold text-zinc-400">PUBLIC - {listaPublic.length} novos pra liberar</h2>
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mt-3">
        {listaPublic.map((it:any)=>(
          <div key={it.arquivo} className="bg-[#162342] p-2 rounded-xl border border-white/10">
            <img src={it.arquivo} className="h-20 w-full object-contain" />
            <p className="text-[10px] truncate">{it.nome}</p>
            {jaExiste(it.arquivo)? <span className="text-[10px] text-green-400">✅ NA LOJA</span> : <button onClick={()=>{ setModalItem(it); setPreco("99.90"); setQtd("10"); setModoEdicao(false); }} className="w-full mt-1 bg-[#E2C9A1] text-black py-1 rounded text-[10px] font-bold">Listar com Valor/Qtd</button>}
          </div>
        ))}
      </div>

      {modalItem && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#162342] p-6 rounded-2xl w-full max-w-sm border border-white/10">
            <h2 className="font-bold text-sm mb-3">{modalItem.nome}</h2>
            <label className="text-xs">Preço R$</label>
            <input value={preco} onChange={e=>setPreco(e.target.value)} type="number" className="w-full p-3 mt-1 mb-3 bg-[#0B1325] rounded-xl border border-white/10" />
            <label className="text-xs">Quantidade</label>
            <input value={qtd} onChange={e=>setQtd(e.target.value)} type="number" className="w-full p-3 mt-1 bg-[#0B1325] rounded-xl border border-white/10" />
            <div className="flex gap-2 mt-5">
              <button onClick={()=>setModalItem(null)} className="flex-1 py-3 rounded-xl bg-white/10">Cancelar</button>
              <button onClick={confirmar} className="flex-1 py-3 rounded-xl bg-[#E2C9A1] text-black font-bold">{modoEdicao?'Salvar':'Listar'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}