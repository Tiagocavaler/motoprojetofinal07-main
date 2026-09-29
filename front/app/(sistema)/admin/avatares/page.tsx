"use client";


import { useEffect, useState } from "react"; // 2. useState guarda lista, useEffect carrega quando abre
import { supabase } from "@/lib/supabaseClient"; // 3. Cliente Supabase (Storage + DB)

export default function AdminAvataresPage() { // 4. Rota /admin/avatares
  const [avatares, setAvatares] = useState<any[]>([]); // 5. Lista de avatares da tabela avatares_loja
  const [nome, setNome] = useState(""); // 6. Nome digitado pro avatar (ex: Pal Dourado)
  const [uploading, setUploading] = useState(false); // 7. Trava botão enquanto sobe

  const carregar = async () => { // 8. BUSCA TODOS OS AVATARES
    const { data } = await supabase.from("avatares_loja").select("*").order("created_at", { ascending: false }); // 9. Pega da tabela avatares_loja ordenado mais novo primeiro
    setAvatares(data || []); // 10. Guarda no estado
  };

  useEffect(() => { carregar(); }, []); // 11. Quando abre a página, carrega lista

  const upload = async (e: any) => { // 12. UPLOAD DE PNG
    const file = e.target.files[0]; // 13. Pega arquivo selecionado
    if (!file) return;
    setUploading(true); // 14. Liga loading

    const fileName = `${Date.now()}-${file.name}`; // 15. Cria nome único com timestamp pra não sobrescrever
    const { error: upError } = await supabase.storage.from("avatares").upload(fileName, file); // 16. Sobe pro bucket "avatares" no Supabase Storage
    if (upError) { alert(upError.message); setUploading(false); return; } // 17. Se erro no storage

    const { data: { publicUrl } } = supabase.storage.from("avatares").getPublicUrl(fileName); // 18. Pega URL pública do arquivo que subiu

    await supabase.from("avatares_loja").insert({ nome: nome || file.name, url: publicUrl }); // 19. Salva na tabela avatares_loja: nome + url pública
    setNome(""); // 20. Limpa input nome
    await carregar(); // 21. Recarrega lista pra mostrar novo
    setUploading(false); // 22. Desliga loading
  };

  const deletar = async (id: string, url: string) => { // 23. DELETA AVATAR
    if (!confirm("Deletar avatar?")) return; // 24. Confirmação
    const path = url.split("/avatares/")[1]; // 25. Extrai caminho do arquivo da URL (ex: 12345-png.png)
    await supabase.storage.from("avatares").remove([path]); // 26. Deleta arquivo do Storage
    await supabase.from("avatares_loja").delete().eq("id", id); // 27. Deleta linha da tabela avatares_loja
    carregar(); // 28. Atualiza lista
  };

  return (
    // 29. JSX - Painel admin
    <div className="p-6 bg-[#0B1325] min-h-screen text-white">
      <h1 className="text-xl font-black text-[#E2C9A1] tracking-widest">AVATARES DA LOJA</h1>
      <p className="text-[11px] text-zinc-500 mt-1">Esses PNGs aparecem para o usuário personalizar o perfil</p>

      {/* 30. Card de upload */}
      <div className="mt-6 bg-[#162342] border border-white/10 p-5 rounded-2xl max-w-xl">
        <input value={nome} onChange={e => setNome(e.target.value)} placeholder="Nome do avatar (ex: Pal Dourado)" className="w-full bg-black/30 border border-white/10 p-3 rounded-xl text-sm mb-3 outline-none" />
        <label className="w-full bg-[#E2C9A1] text-black py-3 rounded-xl font-black text-xs flex justify-center cursor-pointer">
          {uploading? "ENVIANDO..." : "📤 SUBIR PNG"}
          <input type="file" accept="image/png,image/webp,image/jpeg" onChange={upload} className="hidden" /> {/* 31. Input file escondido dentro do label bonito */}
        </label>
      </div>

      {/* 32. Grid de avatares */}
      <div className="mt-6 grid grid-cols-3 md:grid-cols-6 gap-3">
        {avatares.map((av) => (
          <div key={av.id} className="bg-[#162342] border border-white/10 p-2 rounded-xl relative group">
            <img src={av.url} className="w-full aspect-square object-contain bg-black/20 rounded-lg p-2" /> {/* 33. Mostra PNG */}
            <p className="text-[9px] text-center mt-2 text-zinc-400 truncate">{av.nome}</p>
            <button onClick={() => deletar(av.id, av.url)} className="absolute -top-1 -right-1 bg-red-500 text-white w-5 h-5 rounded-full text-[10px] hidden group-hover:flex items-center justify-center">x</button> {/* 34. Botão X só aparece no hover (group-hover) */}
          </div>
        ))}
      </div>
    </div>
  );
}