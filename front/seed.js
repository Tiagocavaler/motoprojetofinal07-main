  // 1. Carrega as chaves do .env.local
  require('dotenv').config({ path: '.env.local' });
  require('dotenv').config({ path: '.env' });
  require('dotenv').config();

  const fs = require('fs');
  const path = require('path');
  const { createClient } = require('@supabase/supabase-js');

  // 2. Pega as chaves - AGORA PRIORIZA A SERVICE_ROLE PARA O SEED
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // a chave secreta
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const finalKey = supabaseServiceKey || supabaseAnonKey;

  console.log('--- DEBUG ---');
  console.log('URL:', supabaseUrl ? 'SIM' : 'NAO');
  console.log('SERVICE_ROLE:', supabaseServiceKey ? 'SIM - usando ela' : 'NAO - usando ANON');
  console.log('ANON:', supabaseAnonKey ? 'SIM' : 'NAO');

  if (!supabaseUrl || !finalKey) {
    console.error('Falta URL ou KEY no .env.local');
    process.exit(1);
  }

  // 3. Cria cliente com a chave mais poderosa
  const supabase = createClient(supabaseUrl, finalKey, {
    auth: { persistSession: false } // não precisa logar para o seed
  });

  async function subir413() {
    let pastaPals = path.join(__dirname, 'public', 'pals');
    if (!fs.existsSync(pastaPals)) {
      pastaPals = path.join(__dirname, 'front', 'public', 'pals');
    }
    if (!fs.existsSync(pastaPals)) {
      // tenta mais um nível (seu caso)
      pastaPals = path.join(__dirname, 'public', 'pals');
    }

    console.log('Pasta:', pastaPals);
    const pngs = fs.readdirSync(pastaPals).filter(a => a.toLowerCase().endsWith('.png'));
    console.log(`Achei ${pngs.length} PNGs`);

    const produtos = pngs.map(nomeArquivo => {
      const nomeLimpo = nomeArquivo.replace(/^T_/, '').replace(/_icon_normal\.png$/i, '').replace(/_/g, ' ').toLowerCase().trim();
      return {
        nome: nomeLimpo,
        imagem: `/pals/${nomeArquivo}`,
        preco: Number((Math.random() * 250 + 49.9).toFixed(2)),
        estoque: Math.floor(Math.random() * 15) + 3,
        ativo_na_loja: true
      };
    });

    console.log('Limpando produtos antigos...');
    // usando service_role o delete sempre funciona
    const { error: delError } = await supabase.from('produtos').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    if(delError) console.log('Aviso ao limpar:', delError.message);
    else console.log('Limpo!');

    console.log('Subindo em lotes de 50...');
    let total = 0;
    for (let i = 0; i < produtos.length; i += 50) {
      const lote = produtos.slice(i, i + 50);
      const { error } = await supabase.from('produtos').insert(lote);
      if (error) {
        console.error(`Erro no lote ${i}:`, error.message);
        console.error(error);
        return;
      } else {
        total += lote.length;
        console.log(`✓ ${total}/${produtos.length}`);
      }
    }
    console.log(`\nFINALIZADO! ${total} Pals no Supabase`);
  }

  subir413().catch(err => console.error('Erro fatal:', err));