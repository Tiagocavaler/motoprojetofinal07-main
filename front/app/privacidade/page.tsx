export default function Privacidade() {
  return (
    <div className="min-h-screen bg-[#0B1325] text-white/90 p-6">
      <div className="max-w-3xl mx-auto bg-[#162342] p-8 rounded-2xl space-y-6">
        <h1 className="text-2xl font-bold text-white">Política de Privacidade</h1>
        <p className="text-sm text-white/50">Última atualização: 06/05/2026</p>

        <section className="space-y-2">
          <h2 className="font-bold text-white">1. Quem somos</h2>
          <p>Este aplicativo é mantido de forma independente com o objetivo de manter em funcionamento um servidor privado do jogo Palworld. Toda e qualquer renda obtida através do aplicativo, incluindo vendas, assinaturas, doações ou anúncios, é integralmente destinada à manutenção, hospedagem, atualização e custos operacionais do referido servidor.</p>
        </section>

        <section className="space-y-2">
          <h2 className="font-bold text-white">2. Quais dados coletamos</h2>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li><b>Dados de cadastro:</b> e-mail e senha criptografada para criação e autenticação da conta.</li>
            <li><b>Dados de transação:</b> histórico de pedidos, valor e status de pagamento (PIX). Não armazenamos dados de cartão, pois o pagamento é processado por gateway externo.</li>
            <li><b>Dados técnicos:</b> endereço IP, tipo de dispositivo e logs de acesso para segurança e prevenção a fraudes.</li>
            <li>Não coletamos localização precisa, contatos, fotos ou arquivos do dispositivo.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="font-bold text-white">3. Para que usamos seus dados</h2>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>Criar e gerenciar sua conta (1 conta por e-mail).</li>
            <li>Processar pedidos e confirmar pagamentos.</li>
            <li>Garantir segurança com regras de negócio: limite de 3 tentativas de recuperação de senha por dia, link de 10 minutos e uso único.</li>
            <li>Manter logs de auditoria para segurança da plataforma.</li>
            <li>Destinar os recursos financeiros para a manutenção do servidor privado de Palworld.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="font-bold text-white">4. Compartilhamento de dados</h2>
          <p className="text-sm">Utilizamos provedores terceirizados essenciais: Supabase (autenticação e banco de dados) e provedor de pagamento PIX. Esses provedores possuem suas próprias políticas de segurança e criptografia TLS. Não vendemos seus dados.</p>
        </section>

        <section className="space-y-2">
          <h2 className="font-bold text-white">5. Armazenamento e Segurança - Art. 46 da LGPD</h2>
          <p className="text-sm">As senhas são armazenadas com hash seguro (bcrypt) e nunca em texto puro. Utilizamos JWT para sessões. O banco possui backup e ambiente de produção separado do desenvolvimento, conforme boas práticas.</p>
        </section>

        <section className="space-y-2">
          <h2 className="font-bold text-white">6. Seus direitos - LGPD Art. 18</h2>
          <p className="text-sm">Você pode a qualquer momento: consultar seus pedidos, corrigir dados, solicitar portabilidade e solicitar a exclusão definitiva da sua conta e dados. A exclusão pode ser feita diretamente no app em Perfil &gt; Excluir conta ou pelo e-mail: [SEU_EMAIL_AQUI].</p>
        </section>

        <section className="space-y-2">
          <h2 className="font-bold text-white">7. Retenção e Exclusão</h2>
          <p className="text-sm">Mantemos seus dados enquanto sua conta estiver ativa. Após solicitação de exclusão, os dados pessoais são apagados ou anonimizados em até 15 dias, exceto os que devem ser mantidos por obrigação legal/fiscal (comprovantes de transação).</p>
        </section>

        <section className="space-y-2">
          <h2 className="font-bold text-white">8. Crianças e Adolescentes</h2>
          <p className="text-sm">Este aplicativo não é direcionado a menores de 13 anos.</p>
        </section>

        <section className="space-y-2">
          <h2 className="font-bold text-white">9. Contato do Encarregado (DPO)</h2>
          <p className="text-sm">Para dúvidas sobre privacidade: [SEU_EMAIL_AQUI] - [SEU NOME / EQUIPE]</p>
        </section>
      </div>
    </div>
  )
}