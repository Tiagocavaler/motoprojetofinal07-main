"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient"; // 2. Cliente

export default function EscolherPage() { // 3. Admin - escolher o que vai pra loja
  const [produtos, setProdutos] = useState<any[]>([]); // 4. Produtos já no banco (ativos na loja)
  const [itensPublic, setItensPublic] = useState<any[]>([]); // 5. Itens da pasta /public - lidos via /api/itens
  const [busca, setBusca] = useState(""); // 6. Busca
  const [filtro, setFiltro] = useState("todos"); // 7. Filtro categoria

  const carregar = async () => { // 8. Carrega do banco
    const { data } = await supabase.from("produtos").select("*").order("nome"); // 9. SELECT * FROM produtos ORDER BY nome
    if (data) setProdutos(data);
  };

  const carregarPublic = async () => { // 10. Carrega arquivos locais - sua API lista /public
    try {
      const res = await fetch("/api/itens"); // 11. Endpoint que lê fs.readdir da public e devolve { nome, arquivo, categoria }
      const data = await res.json();
      setItensPublic(data || []);
    } catch (e) {
      setItensPublic([]); // 12. Se falhar, zera
    }
  };

  useEffect(() => {
    carregar(); // 13. Roda ambos ao abrir
    carregarPublic();
  }, []);

  const cadastrarPublic = async (item: any, preco: string, qtd: string) => { // 14. Botão "Liberar p/ Loja"
    const { error } = await supabase.from("produtos").insert({ // 15. Insere novo produto no banco a partir do arquivo da public
      nome: item.nome, // 16. nome do arquivo vira nome do produto
      imagem: item.arquivo, // 17. caminho ex: "/armas/ak47.png" - vira campo imagem
      preco: parseFloat(preco), // 18. Transforma string "99.90" em número
      estoque: parseInt(qtd), // 19. Quantidade
      ativo_na_loja: true, // 20. Já entra ativo pro catálogo mostrar
      categoria: item.categoria // 21. arma, armadura, etc
    });
    if (error) alert(error.message); // 22. Mostra erro RLS etc
    else carregar(); // 23. Recarrega lista do banco
  };

  const filtradosPals = produtos.filter(p => p.nome.toLowerCase().includes(busca.toLowerCase())); // 24. Filtra banco por nome

  const filtradosPublic = itensPublic.filter((i: any) => { // 25. Filtra public por nome + categoria
    const matchBusca = i.nome.toLowerCase().includes(busca.toLowerCase());
    const matchCat = filtro === "todos" || i.categoria === filtro;
    return matchBusca && matchCat;
  });

  const jaExiste = (arquivo: string) => produtos.some(p => p.imagem === arquivo); // 26. Checa se esse arquivo da public já foi cadastrado - evita duplicar

  return (
    <div className="min-h-screen bg-[#0B1325] p-6 text-white">
      <h1 className="text-2xl font-bold text-[#E2C9A1]">Admin - Escolha o Pal e Liste</h1>

      <input
        value={busca}
        onChange={e=>setBusca(e.target.value)}
        placeholder="Buscar Pal..."
        className="w-full bg-[#162342] p-4 rounded-xl mt-4 border border-white/10"
      />

      <div className="flex gap-2 mt-4 flex-wrap">
        {['todos','pal','arma','armadura','escudo','municao','esfera'].map(c => (
          <button key={c} onClick={()=>setFiltro(c)} className={`px-4 py-2 rounded-full text-xs font-bold ${filtro===c? 'bg-[#E2C9A1] text-black' : 'bg-[#162342] border border-white/10'}`}>
            {c.toUpperCase()}
          </button>
        ))}
      </div>

      <h2 className="mt-8 font-bold text-[#E2C9A1]">Pals do Banco ({filtradosPals.length})</h2>

      <h2 className="mt-10 font-bold text-[#E2C9A1]">Itens da Public/ ({filtradosPublic.length}) - NOVO</h2>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-3">
        {filtradosPublic.map((item: any) => (
          <div key={item.arquivo} className="bg-[#162342] p-3 rounded-xl border border-white/10">
            <img src={item.arquivo} className="w-full h-20 object-contain" alt={item.nome} />
            <p className="text-xs mt-2 truncate">{item.nome}</p>
            <p className="text-[10px] text-zinc-400">{item.categoria}</p>
            {jaExiste(item.arquivo)? // 27. Se já existe mostra check
              <span className="text-[10px] text-green-400">✅ NA LOJA</span> :
              <button onClick={()=>{ const preco=prompt("Preço?","99.90"); const qtd=prompt("Qtd?","10"); if(preco&&qtd) cadastrarPublic(item, preco, qtd)}} className="w-full mt-2 bg-[#E2C9A1] text-black py-2 rounded text-xs font-bold">Liberar p/ Loja</button> // 28. Senão pergunta preço e qtd via prompt e cadastra
            }
          </div>
        ))}
      </div>
    </div>
  );
}