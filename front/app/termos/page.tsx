export default function Termos() {
  return (
    <div className="min-h-screen bg-[#0B1325] text-white/90 p-6">
      <div className="max-w-3xl mx-auto bg-[#162342] p-8 rounded-2xl space-y-6">
        <h1 className="text-2xl font-bold text-white">Termos de Uso</h1>
        <p className="text-sm text-white/50">Última atualização: 06/05/2026</p>

        <section className="space-y-2">
          <h2 className="font-bold text-white">1. Aceitação</h2>
          <p className="text-sm">Ao criar uma conta neste aplicativo, você declara que leu, entendeu e concorda com estes Termos de Uso e com nossa Política de Privacidade. Se não concordar, não utilize o aplicativo. É obrigatório ter 13 anos ou mais.</p>
        </section>

        <section className="space-y-2">
          <h2 className="font-bold text-white">2. Natureza do Serviço e Destinação da Renda</h2>
          <p className="text-sm">Este é um aplicativo independente, de iniciativa privada e comunitária, criado com o único propósito de financiar e manter em funcionamento um servidor privado do jogo Palworld.</p>
          <p className="text-sm font-bold text-[#E2C9A1]">2.1. 100% de toda a renda líquida obtida através deste aplicativo (vendas, taxas, assinaturas, doações) é destinada exclusivamente para custos de hospedagem, manutenção, atualização, proteção DDoS e infraestrutura do servidor privado de Palworld.</p>
          <p className="text-sm">2.2. Este projeto NÃO possui vínculo, afiliação, patrocínio ou endosso da Pocketpair, Inc., desenvolvedora oficial de Palworld. Palworld é marca de seus respectivos proprietários.</p>
        </section>

        <section className="space-y-2">
          <h2 className="font-bold text-white">3. Contas de Usuário</h2>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>É permitido apenas 1 (uma) conta por e-mail, conforme regra de segurança.</li>
            <li>Você é responsável por manter sua senha em sigilo. Senhas são armazenadas de forma criptografada.</li>
            <li>Não é permitido compartilhar conta, vender ou transferir acesso.</li>
            <li>Podemos suspender contas em caso de fraude, tentativa de invasão ou uso de bots para compra simultânea.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="font-bold text-white">4. Pedidos, Pagamentos e PIX</h2>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>Todos os pedidos são registrados em banco de dados com status.</li>
            <li>O pagamento via PIX é confirmado por gateway externo. O status mudará de "PIX Gerado" para "PIX Pago" automaticamente.</li>
            <li>Em caso de pagamento não confirmado, o pedido expira automaticamente.</li>
            <li>Preços e disponibilidade podem ser alterados pelo administrador a qualquer momento, com registro em log de auditoria.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="font-bold text-white">5. Recuperação de Senha</h2>
          <p className="text-sm">Por motivos de segurança, a recuperação de senha é limitada a 3 (três) solicitações por e-mail a cada 24 horas. Cada link enviado tem validade de 10 (dez) minutos e uso único.</p>
        </section>

        <section className="space-y-2">
          <h2 className="font-bold text-white">6. Regras do Servidor de Palworld</h2>
          <p className="text-sm">O acesso e permanência no servidor privado de Palworld mantido por este projeto estão sujeitos a regras próprias de conduta do servidor. O direito de compra no aplicativo não garante permanência no servidor em caso de violação de regras (uso de cheats, hacks, comportamento tóxico). Nesses casos, não há reembolso, pois o recurso já foi destinado à infraestrutura.</p>
        </section>

        <section className="space-y-2">
          <h2 className="font-bold text-white">7. Política de Reembolso e Cancelamento</h2>
          <p className="text-sm">Por se tratar de financiamento coletivo para manutenção de servidor, com custos antecipados de hospedagem, não realizamos reembolso após a confirmação do pagamento e liberação do benefício, exceto em casos de falha técnica comprovada ou determinação legal. O usuário pode solicitar cancelamento antes da confirmação do PIX.</p>
        </section>

        <section className="space-y-2">
          <h2 className="font-bold text-white">8. Propriedade Intelectual</h2>
          <p className="text-sm">Todo o código, layout e sistema de e-commerce deste aplicativo são de propriedade do mantenedor. É proibida a cópia ou engenharia reversa.</p>
        </section>

        <section className="space-y-2">
          <h2 className="font-bold text-white">9. Limitação de Responsabilidade</h2>
          <p className="text-sm">O aplicativo é fornecido "como está". Não garantimos que o serviço ficará 100% ininterrupto, pois depende de provedores terceiros (Supabase, hospedagem, internet). Em caso de descontinuidade do servidor de Palworld, avisaremos com 30 dias de antecedência quando possível.</p>
        </section>

        <section className="space-y-2">
          <h2 className="font-bold text-white">10. Exclusão de Conta</h2>
          <p className="text-sm">Você pode excluir sua conta a qualquer momento em Perfil &gt; Excluir Conta. A exclusão apaga seus dados pessoais, mantendo apenas registros anonimizados exigidos por lei fiscal.</p>
        </section>

        <section className="space-y-2">
          <h2 className="font-bold text-white">11. Contato e Foro</h2>
          <p className="text-sm">Dúvidas: [SEU_EMAIL_AQUI]. Fica eleito o foro da comarca de Criciúma/SC para dirimir quaisquer questões.</p>
        </section>

      </div>
    </div>
  )
}