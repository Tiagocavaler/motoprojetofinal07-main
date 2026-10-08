package com.example.motoprojetofinal.application.services;

import com.example.motoprojetofinal.domain.entities.Produto;
import com.example.motoprojetofinal.domain.repository.ProdutoRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProdutoSyncService {

    private final ProdutoRepository produtoRepository;
    private final RestClient restClient = RestClient.builder()
            .baseUrl("https://raw.githubusercontent.com")
            .build();

    @Scheduled(cron = "0 0 3 * * MON")
    public void sincronizarProdutos() {
        log.info("[SYNC] Iniciando atualização automática do catálogo...");
        try {
            String endpoint = "/seu-usuario/seu-repo/main/produtos.json";

            List<Map<String, Object>> itensApi = restClient.get()
                    .uri(endpoint)
                    .retrieve()
                    .body(new ParameterizedTypeReference<List<Map<String, Object>>>() {});

            if (itensApi == null || itensApi.isEmpty()) {
                log.warn("[SYNC] Nenhum produto retornado da API externa.");
                return;
            }

            for (Map<String, Object> item : itensApi) {
                // CORRIGIDO: Pega como Number pra funcionar tanto com Integer quanto Long
                Number idNumber = (Number) item.get("id");
                Long idApi = idNumber.longValue();

                String nomeApi = (String) item.get("name");

                List<String> types = (List<String>) item.get("types");
                String tipoApi = types != null ? String.join(", ", types) : "Sem tipo";

                Produto produto = new Produto();
                produto.setId(idApi); // AGORA É LONG CORRETO
                produto.setNome(nomeApi);
                produto.setTipo(tipoApi);
                produto.setPreco(new BigDecimal("100.00")); // Preço padrão, já que sua API não manda preço
                produto.setEstoque(10);

                produtoRepository.save(produto);
            }
            log.info("[SYNC] Sucesso! {} produtos sincronizados.", itensApi.size());

        } catch (Exception e) {
            log.error("[SYNC ERRO] Falha ao sincronizar: {}", e.getMessage(), e);
        }
    }
}