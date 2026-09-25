"use client";

import { useEffect, useState } from "react";
import { QRCodeCanvas } from "qrcode.react"; // 2. Lib QR
import { supabase } from "@/lib/supabaseClient"; // 3. Pega config da loja

function format(tamanho: number, valor: string) { // 4. Não usado - sobrou
  return `${String(tamanho).padStart(2, '0')}${valor}`;
}
function formatLen(valor: string) { // 5. Formato EMV PIX - len 2 dígitos + valor - ex: 0014 + BR.GOV.BCB.PIX
  return `${String(valor.length).padStart(2, '0')}${valor}`;
}
function crc16(payload: string) { // 6. CRC16-CCITT 0x1021 - obrigatório no final do PIX pra validar
  let crc = 0xFFFF;
  for (let i = 0; i < payload.length; i++) {
    crc ^= payload.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      crc = (crc & 0x8000)? (crc << 1) ^ 0x1021 : crc << 1;
    }
  }
  return (crc & 0xFFFF).toString(16).toUpperCase().padStart(4, '0'); // 7. 4 hex
}

export default function PixCheckout({ valor, pedidoId }: { valor: number, pedidoId: string }) {
  const [config, setConfig] = useState<any>(null); // 8. config do admin - pix_chave, pix_nome, pix_cidade
  const [loading, setLoading] = useState(true);

  useEffect(() => { // 9. Carrega loja_config - tabela com 1 linha
    supabase.from("loja_config").select("*").single().then(({ data }) => {
      setConfig(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="p-6 bg-[#162342] rounded-2xl text-zinc-400 text-sm">Carregando PIX...</div>;
  if (!config?.pix_chave) return <div className="p-6 bg-[#162342] rounded-2xl text-red-400 text-sm">PIX não configurado pelo administrador. Vá em /admin/config</div>; // 10. Sem chave não gera

  const chave = config.pix_chave.trim(); // 11. cpf/cnpj/email/aleatória
  const nome = (config.pix_nome || "PAL STORE").substring(0, 25).toUpperCase(); // 12. Regra BACEN - max 25 chars maiúsculo
  const cidade = (config.pix_cidade || "CRICIUMA").substring(0, 15).toUpperCase(); // 13. Max 15 chars
  const valorStr = valor.toFixed(2); // 14. 100 -> "100.00"
  const txid = pedidoId.replace(/[^A-Za-z0-9]/g, '').substring(0, 25) || "***"; // 15. id sem traço - max 25

  // 16. Monta campo 26 - merchant account - GUI + chave
  const campo26Interno = `0014BR.GOV.BCB.PIX01${formatLen(chave)}`; // 17. 00=GUI 01=chave
  const campo26 = `26${formatLen(campo26Interno)}`; // 18. 26 = campo PIX

  const campo54 = `54${formatLen(valorStr)}`; // 19. 54 = valor
  const campo59 = `59${formatLen(nome)}`; // 20. 59 = nome recebedor
  const campo60 = `60${formatLen(cidade)}`; // 21. 60 = cidade
  const campo62 = `62${formatLen(`05${formatLen(txid)}`)}05${formatLen(txid)}`; // 22. 62 = txid - 05 dentro

  let payload = `000201${campo26}520400005303986${campo54}5802BR${campo59}${campo60}${campo62}6304`; // 23. Monta payload sem CRC - 00=payload format, 52=merchant cat, 53=986=Real
  payload += crc16(payload); // 24. 63 + CRC

  return (
    <div className="bg-[#162342] border border-white/10 p-6 rounded-2xl text-center max-w-[340px] mx-auto">
      <h3 className="font-black text-[#E2C9A1] tracking-widest text-sm">PAGUE COM PIX</h3>
      <p className="text-[11px] text-zinc-400 mt-1">Conta do administrador: {nome}</p>

      <div className="bg-white p-4 rounded-xl mt-5 inline-block">
        <QRCodeCanvas value={payload} size={220} /> {/* 25. QR do payload */}
      </div>

      <p className="text-xs text-white mt-4 font-bold">R$ {valorStr}</p>
      <p className="text-[10px] text-zinc-500 break-all mt-3 bg-black/30 p-3 rounded-xl text-left">{payload}</p> {/* 26. Copia e cola */}

      <button
        onClick={() => {
          navigator.clipboard.writeText(payload); // 27. Copia
          alert("Código PIX copiado!");
        }}
        className="w-full mt-4 bg-[#E2C9A1] text-black py-3 rounded-xl font-black text-sm"
      >
        COPIAR CÓDIGO PIX
      </button>
      <p className="text-[9px] text-zinc-600 mt-2">Pedido: {pedidoId}</p>
    </div>
  );
}