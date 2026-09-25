import { createClient } from '@supabase/supabase-js' // 1. client oficial supabase

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!, // 2. URL do projeto - NEXT_PUBLIC = vai pro browser
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY! // 3. anon key - pública mas com RLS protege
) // 4. ! = diz pro TS que não é undefined - se não tiver .env quebra em runtime