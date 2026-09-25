import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// 1. Middleware liberado para TCC usando localStorage - não dá pra proteger admin com localStorage no middleware porque middleware roda no servidor
// 2. A proteção real do admin está dentro de app/(sistema)/admin/page.tsx - checa localStorage lá com useEffect
export function middleware(req: NextRequest) {
  return NextResponse.next() // 3. Deixa tudo passar
}

export const config = {
  matcher: [], // 4. Vazio = não roda em nenhuma rota - se colocar '/admin/:path*' começaria a rodar
};