import ProdutoClient from "./ProdutoClient";

// Gera todos os produtos na hora do build
export async function generateStaticParams() {
  try {
    // pega IDs do Supabase durante o build
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const { data } = await supabase.from("produtos").select("id");
    if (data && data.length > 0) {
      return data.map((p: any) => ({ id: String(p.id) }));
    }
  } catch (e) {
    console.log("Build offline, usando fallback");
  }
  // fallback se não tiver internet no build
  return [{ id: '1' }, { id: '2' }, { id: '3' }];
}

export default function Page({ params }: { params: { id: string } }) {
  return <ProdutoClient id={params.id} />;
}