import ProdutoClient from "./ProdutoClient";

import { useEffect, useState } from "react"; // 2. Estado + efeito
import { supabase } from "@/lib/supabaseClient"; // 3. Cliente supabase - atenção pro caminho relativo, ideal usar @/lib/supabase
import { useParams } from "next/navigation"; // 4. Pega { id } da rota /produto/[id]
import Link from "next/link"; // 5. Link voltar

export default function Page({ params }: { params: { id: string } }) {
  return <ProdutoClient id={params.id} />;
}