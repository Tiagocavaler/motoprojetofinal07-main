"use client";

import Link from "next/link"; // 2. Link sem reload
import { usePathname } from "next/navigation"; // 3. Pega rota atual (ex: /admin/pedidos, /catalogo)

export default function SistemaHeader() { // 4. Header que muda se é ADMIN ou LOJA
  const pathname = usePathname(); // 5. Rota atual - ex: /admin/pedidos
  const isAdmin = pathname.startsWith("/admin"); // 6. Se começa com /admin, é painel admin, senão é loja

  if (isAdmin) { // 7. HEADER DO ADMIN
    return (
      <header className="bg-[#162342] border-b border-white/10 p-4 flex justify-between items-center sticky top-0 z-50">
        <Link href="/admin/pedidos" className="font-black text-[#E2C9A1]">ADMIN</Link>
        <div className="flex gap-2">
          <Link href="/admin/pedidos" className="bg-[#E2C9A1] text-black px-4 py-2 rounded-xl text-xs font-bold">Pedidos</Link>
          <Link href="/catalogo" className="bg-white/10 px-4 py-2 rounded-xl text-xs text-white">Ver Loja</Link>
        </div>
      </header>
    );
  }

  return ( // 8. HEADER DA LOJA - cliente normal
    <header className="bg-[#162342] border-b border-white/10 p-4 flex justify-between items-center sticky top-0 z-50">
      <Link href="/catalogo" className="font-black text-[#E2C9A1] text-lg">PAL STORE</Link>
      <nav className="flex gap-3 items-center">
        <Link href="/catalogo" className="text-xs px-3 py-2 rounded-lg bg-white/10 text-white">Catálogo</Link>
        <Link href="/carrinho" className="text-xs px-3 py-2 rounded-lg bg-white/10 text-white">Carrinho</Link>
        <Link href="/pedidos" className="text-xs px-4 py-2 rounded-xl font-bold bg-[#E2C9A1] text-black">Meus Pedidos</Link>
      </nav>
    </header>
  );
}