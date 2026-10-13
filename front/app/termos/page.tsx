export default function Termos() {
  return (
    <div className="min-h-screen bg-[#0B1325] text-white/90 p-6">
      <div className="max-w-3xl mx-auto bg-[#162342] p-8 rounded-2xl space-y-6">
        <h1 className="text-2xl font-bold text-white">Termos de Uso</h1>
        <p className="text-sm text-white/50">Ãšltima atualizaÃ§Ã£o: 06/05/2026</p>

        <section className="space-y-2">
          <h2 className="font-bold text-white">1. AceitaÃ§Ã£o</h2>
          <p className="text-sm">Ao criar uma conta neste aplicativo, vocÃª declara que leu, entendeu e concorda com estes Termos de Uso e com nossa PolÃ­tica de Privacidade. Se nÃ£o concordar, nÃ£o utilize o aplicativo. Ã‰ obrigatÃ³rio ter 13 anos ou mais.</p>
        </section>

        <section className="space-y-2">
          <h2 className="font-bold text-white">2. Natureza do ServiÃ§o e DestinaÃ§Ã£o da Renda</h2>
          <p className="text-sm">Este Ã© um aplicativo independente, de iniciativa privada e comunitÃ¡ria, criado com o Ãºnico propÃ³sito de financiar e manter em funcionamento um servidor privado do jogo Palworld.</p>
          <p className="text-sm font-bold text-[#E2C9A1]">2.1. 100% de toda a renda lÃ­quida obtida atravÃ©s deste aplicativo (vendas, taxas, assinaturas, doaÃ§Ãµes) Ã© destinada exclusivamente para custos de hospedagem, manutenÃ§Ã£o, atualizaÃ§Ã£o, proteÃ§Ã£o DDoS e infraestrutura do servidor privado de Palworld.</p>
          <p className="text-sm">2.2. Este projeto NÃƒO possui vÃ­nculo, afiliaÃ§Ã£o, patrocÃ­nio ou endosso da Pocketpair, Inc., desenvolvedora oficial de Palworld. Palworld Ã© marca de seus respectivos proprietÃ¡rios.</p>
        </section>

        <section className="space-y-2">
          <h2 className="font-bold text-white">3. Contas de UsuÃ¡rio</h2>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>Ã‰ permitido apenas 1 (uma) conta por e-mail, conforme regra de seguranÃ§a.</li>
            <li>VocÃª Ã© responsÃ¡vel por manter sua senha em sigilo. Senhas sÃ£o armazenadas de forma criptografada.</li>
            <li>NÃ£o Ã© permitido compartilhar conta, vender ou transferir acesso.</li>
            <li>Podemos suspender contas em caso de fraude, tentativa de invasÃ£o ou uso de bots para compra simultÃ¢nea.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="font-bold text-white">4. Pedidos, Pagamentos e PIX</h2>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>Todos os pedidos sÃ£o registrados em banco de dados com status.</li>
            <li>O pagamento via PIX Ã© confirmado por gateway externo. O status mudarÃ¡ de "PIX Gerado" para "PIX Pago" automaticamente.</li>
            <li>Em caso de pagamento nÃ£o confirmado, o pedido expira automaticamente.</li>
            <li>PreÃ§os e disponibilidade podem ser alterados pelo administrador a qualquer momento, com registro em log de auditoria.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="font-bold text-white">5. RecuperaÃ§Ã£o de Senha</h2>
          <p className="text-sm">Por motivos de seguranÃ§a, a recuperaÃ§Ã£o de senha Ã© limitada a 3 (trÃªs) solicitaÃ§Ãµes por e-mail a cada 24 horas. Cada link enviado tem validade de 10 (dez) minutos e uso Ãºnico.</p>
        </section>

        <section className="space-y-2">
          <h2 className="font-bold text-white">6. Regras do Servidor de Palworld</h2>
          <p className="text-sm">O acesso e permanÃªncia no servidor privado de Palworld mantido por este projeto estÃ£o sujeitos a regras prÃ³prias de conduta do servidor. O direito de compra no aplicativo nÃ£o garante permanÃªncia no servidor em caso de violaÃ§Ã£o de regras (uso de cheats, hacks, comportamento tÃ³xico). Nesses casos, nÃ£o hÃ¡ reembolso, pois o recurso jÃ¡ foi destinado Ã  infraestrutura.</p>
        </section>

        <section className="space-y-2">
          <h2 className="font-bold text-white">7. PolÃ­tica de Reembolso e Cancelamento</h2>
          <p className="text-sm">Por se tratar de financiamento coletivo para manutenÃ§Ã£o de servidor, com custos antecipados de hospedagem, nÃ£o realizamos reembolso apÃ³s a confirmaÃ§Ã£o do pagamento e liberaÃ§Ã£o do benefÃ­cio, exceto em casos de falha tÃ©cnica comprovada ou determinaÃ§Ã£o legal. O usuÃ¡rio pode solicitar cancelamento antes da confirmaÃ§Ã£o do PIX.</p>
        </section>

        <section className="space-y-2">
          <h2 className="font-bold text-white">8. Propriedade Intelectual</h2>
          <p className="text-sm">Todo o cÃ³digo, layout e sistema de e-commerce deste aplicativo sÃ£o de propriedade do mantenedor. Ã‰ proibida a cÃ³pia ou engenharia reversa.</p>
        </section>

        <section className="space-y-2">
          <h2 className="font-bold text-white">9. LimitaÃ§Ã£o de Responsabilidade</h2>
          <p className="text-sm">O aplicativo Ã© fornecido "como estÃ¡". NÃ£o garantimos que o serviÃ§o ficarÃ¡ 100% ininterrupto, pois depende de provedores terceiros (Supabase, hospedagem, internet). Em caso de descontinuidade do servidor de Palworld, avisaremos com 30 dias de antecedÃªncia quando possÃ­vel.</p>
        </section>

        <section className="space-y-2">
          <h2 className="font-bold text-white">10. ExclusÃ£o de Conta</h2>
          <p className="text-sm">VocÃª pode excluir sua conta a qualquer momento em Perfil &gt; Excluir Conta. A exclusÃ£o apaga seus dados pessoais, mantendo apenas registros anonimizados exigidos por lei fiscal.</p>
        </section>

        <section className="space-y-2">
          <h2 className="font-bold text-white">11. Contato e Foro</h2>
          <p className="text-sm">DÃºvidas: [SEU_EMAIL_AQUI]. Fica eleito o foro da comarca de CriciÃºma/SC para dirimir quaisquer questÃµes.</p>
        </section>

      </div>
    </div>
  )
}
