export default function Privacidade() {
  return (
    <div className="min-h-screen bg-[#0B1325] text-white/90 p-6">
      <div className="max-w-3xl mx-auto bg-[#162342] p-8 rounded-2xl space-y-6">
        <h1 className="text-2xl font-bold text-white">PolÃ­tica de Privacidade</h1>
        <p className="text-sm text-white/50">Ãšltima atualizaÃ§Ã£o: 06/05/2026</p>

        <section className="space-y-2">
          <h2 className="font-bold text-white">1. Quem somos</h2>
          <p>Este aplicativo Ã© mantido de forma independente com o objetivo de manter em funcionamento um servidor privado do jogo Palworld. Toda e qualquer renda obtida atravÃ©s do aplicativo, incluindo vendas, assinaturas, doaÃ§Ãµes ou anÃºncios, Ã© integralmente destinada Ã  manutenÃ§Ã£o, hospedagem, atualizaÃ§Ã£o e custos operacionais do referido servidor.</p>
        </section>

        <section className="space-y-2">
          <h2 className="font-bold text-white">2. Quais dados coletamos</h2>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li><b>Dados de cadastro:</b> e-mail e senha criptografada para criaÃ§Ã£o e autenticaÃ§Ã£o da conta.</li>
            <li><b>Dados de transaÃ§Ã£o:</b> histÃ³rico de pedidos, valor e status de pagamento (PIX). NÃ£o armazenamos dados de cartÃ£o, pois o pagamento Ã© processado por gateway externo.</li>
            <li><b>Dados tÃ©cnicos:</b> endereÃ§o IP, tipo de dispositivo e logs de acesso para seguranÃ§a e prevenÃ§Ã£o a fraudes.</li>
            <li>NÃ£o coletamos localizaÃ§Ã£o precisa, contatos, fotos ou arquivos do dispositivo.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="font-bold text-white">3. Para que usamos seus dados</h2>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>Criar e gerenciar sua conta (1 conta por e-mail).</li>
            <li>Processar pedidos e confirmar pagamentos.</li>
            <li>Garantir seguranÃ§a com regras de negÃ³cio: limite de 3 tentativas de recuperaÃ§Ã£o de senha por dia, link de 10 minutos e uso Ãºnico.</li>
            <li>Manter logs de auditoria para seguranÃ§a da plataforma.</li>
            <li>Destinar os recursos financeiros para a manutenÃ§Ã£o do servidor privado de Palworld.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="font-bold text-white">4. Compartilhamento de dados</h2>
          <p className="text-sm">Utilizamos provedores terceirizados essenciais: Supabase (autenticaÃ§Ã£o e banco de dados) e provedor de pagamento PIX. Esses provedores possuem suas prÃ³prias polÃ­ticas de seguranÃ§a e criptografia TLS. NÃ£o vendemos seus dados.</p>
        </section>

        <section className="space-y-2">
          <h2 className="font-bold text-white">5. Armazenamento e SeguranÃ§a - Art. 46 da LGPD</h2>
          <p className="text-sm">As senhas sÃ£o armazenadas com hash seguro (bcrypt) e nunca em texto puro. Utilizamos JWT para sessÃµes. O banco possui backup e ambiente de produÃ§Ã£o separado do desenvolvimento, conforme boas prÃ¡ticas.</p>
        </section>

        <section className="space-y-2">
          <h2 className="font-bold text-white">6. Seus direitos - LGPD Art. 18</h2>
          <p className="text-sm">VocÃª pode a qualquer momento: consultar seus pedidos, corrigir dados, solicitar portabilidade e solicitar a exclusÃ£o definitiva da sua conta e dados. A exclusÃ£o pode ser feita diretamente no app em Perfil &gt; Excluir conta ou pelo e-mail: [SEU_EMAIL_AQUI].</p>
        </section>

        <section className="space-y-2">
          <h2 className="font-bold text-white">7. RetenÃ§Ã£o e ExclusÃ£o</h2>
          <p className="text-sm">Mantemos seus dados enquanto sua conta estiver ativa. ApÃ³s solicitaÃ§Ã£o de exclusÃ£o, os dados pessoais sÃ£o apagados ou anonimizados em atÃ© 15 dias, exceto os que devem ser mantidos por obrigaÃ§Ã£o legal/fiscal (comprovantes de transaÃ§Ã£o).</p>
        </section>

        <section className="space-y-2">
          <h2 className="font-bold text-white">8. CrianÃ§as e Adolescentes</h2>
          <p className="text-sm">Este aplicativo nÃ£o Ã© direcionado a menores de 13 anos.</p>
        </section>

        <section className="space-y-2">
          <h2 className="font-bold text-white">9. Contato do Encarregado (DPO)</h2>
          <p className="text-sm">Para dÃºvidas sobre privacidade: [SEU_EMAIL_AQUI] - [SEU NOME / EQUIPE]</p>
        </section>
      </div>
    </div>
  )
}
