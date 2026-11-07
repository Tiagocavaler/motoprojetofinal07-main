package com.example.motoprojetofinal.application.services;

import com.example.motoprojetofinal.domain.entities.Produto;
import com.example.motoprojetofinal.domain.repository.ProdutoRepository;
import com.example.motoprojetofinal.infra.external.ProdutoApiExternaClient;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProdutoSyncService {

    private final ProdutoRepository produtoRepository;
    private final ProdutoApiExternaClient apiExternaClient;

    @Scheduled(cron = "0 0 3 * * MON")
    public void sincronizarProdutos() {
        log.info("[SYNC] Iniciando atualização automática do catálogo...");
        try {
            List<Map<String, Object>> itensApi = apiExternaClient.buscarProdutosExternos();

            if (itensApi == null || itensApi.isEmpty()) {
                log.warn("[SYNC] Nenhum produto retornado da API externa.");
                return;
            }

            int novos = 0;
            int ignorados = 0;

            for (Map<String, Object> item : itensApi) {
                Number idNumber = (Number) item.get("id");
                Long idApi = idNumber.longValue();
                String nomeApi = (String) item.get("name");

                if (produtoRepository.existsByNomeIgnoreCase(nomeApi)) {
                    ignorados++;
                    continue;
                }
                if (produtoRepository.existsById(idApi)) {
                    ignorados++;
                    continue;
                }

                List<String> types = (List<String>) item.get("types");
                String tipoApi = types != null ? String.join(", ", types) : "Sem tipo";

                Produto produto = new Produto();
                produto.setId(idApi);
                produto.setNome(nomeApi);
                produto.setTipo(tipoApi);
                produto.setPreco(new BigDecimal("100.00"));
                produto.setEstoque(10);
                produto.setAtivoNaLoja(true);
                produto.setSincronizado(true);
                produto.setOrigem("REMOTE");
                produto.setUpdatedAt(LocalDateTime.now());

                if (item.containsKey("imagem_url")) {
                    produto.setImagemUrl((String) item.get("imagem_url"));
                }

                produtoRepository.save(produto);
                novos++;
            }
            log.info("[SYNC] Sucesso! {} novos, {} ignorados (repetidos).", novos, ignorados);

        } catch (Exception e) {
            log.error("[SYNC ERRO] Falha ao sincronizar: {} - Continuando offline no H2", e.getMessage());
        }
    }

    public void sincronizar() {
        sincronizarProdutos();
    }
}