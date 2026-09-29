"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Siderbar(){ // 2. Typo no nome - Siderbar mas funciona
  const pathname = usePathname(); // 3. Rota atual - ex: /home, /admin/config
  const active = (p: string) => pathname === p || pathname?.startsWith(p + "/"); // 4. Ativo se igual ou subrota - /admin/config ativa /admin/config/edit

  const linkStyle = (p: string) => ({ // 5. Estilo inline dinâmico se ativo
    padding: '0.7rem 1rem',
    borderRadius: 12,
    background: active(p) ? 'rgba(226,201,161,0.15)' : 'transparent', // 6. Fundo dourado se ativo
    color: active(p) ? '#E2C9A1' : '#D3C9BF',
    border: '1px solid' as const,
    borderColor: active(p) ? '#E2C9A1' : 'transparent',
    textDecoration: 'none' as const,
    fontSize: '0.9rem',
    fontWeight: 600 as const,
  });

  return (
    <aside style={{ width: 260, minHeight: '100%', backgroundColor: 'rgba(17, 28, 53, 0.85)', backdropFilter: 'blur(10px)', borderRight: '1px solid rgba(226, 201, 161, 0.1)', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <p style={{ fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#E2C9A1', marginBottom: '0.5rem' }}>Menu</p> {/* 7. Seção Menu */}
      
      <Link href="/home" style={linkStyle('/home')}>🏪 Loja</Link>
      <Link href="/guia" style={linkStyle('/guia')}>🗺️ Guia / Mapa</Link>
      <Link href="/produto" style={linkStyle('/produto')}>🧮 Calculadora</Link>

      <div style={{ height: 1, background: 'rgba(255,255,255,0.08)', margin: '0.5rem 0' }} /> {/* 8. Divisor */}

      <p style={{ fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#E2C9A1', marginBottom: '0.2rem' }}>Minha Conta</p> {/* 9. Seção Conta */}
      <Link href="/perfil" style={linkStyle('/perfil')}>👤 Meu Perfil</Link>

      <div style={{ height: 1, background: 'rgba(255,255,255,0.08)', margin: '0.5rem 0' }} />

      <p style={{ fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#E2C9A1', marginBottom: '0.2rem' }}>Admin</p> {/* 10. Seção Admin - TODO: esconder se não for admin */}
      <Link href="/admin/config" style={linkStyle('/admin/config')}>⚙️ PIX / Loja</Link>
      <Link href="/admin/produtos" style={linkStyle('/admin/produtos')}>📦 Produtos</Link>
      <Link href="/admin/avatares" style={linkStyle('/admin/avatares')}>🎨 Avatares</Link>
    </aside>
  );
}