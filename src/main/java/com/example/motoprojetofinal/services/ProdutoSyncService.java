package com.example.motoprojetofinal.services;

import com.example.motoprojetofinal.entities.Produto;
import com.example.motoprojetofinal.repository.ProdutoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import java.util.List;
import java.util.Map;

@Service
public class ProdutoSyncService {

    @Autowired
    private ProdutoRepository produtoRepository; // Injetado automaticamente pelo Spring

    private final RestClient restClient = RestClient.create();

    @Scheduled(cron = "0 0 3 * * MON")
    public void sincronizarProdutos() {
        System.out.println("[SERVICES] Iniciando atualização automática do catálogo de produtos...");
        try {
            String url = "https://githubusercontent.com";

            List<Map<String, Object>> itensApi = restClient.get()
                    .uri(url)
                    .retrieve()
                    .body(List.class);

            if (itensApi != null) {
                for (Map<String, Object> item : itensApi) {
                    Integer idApi = (Integer) item.get("id");
                    String nomeApi = (String) item.get("name");

                    List<String> types = (List<String>) item.get("types");
                    String tipoApi = String.join(", ", types);

                    // Criamos o objeto limpo, sem passar parâmetros no construtor
                    Produto produto = new Produto();

                    // Definitions os valores que vieram da API externa
                    produto.setId(idApi);
                    produto.setNome(nomeApi);
                    produto.setTipo(tipoApi);

                    // O repositório injetado via @Autowired faz a gravação
                    produtoRepository.save(produto);
                }
                System.out.println("[SERVICES] Sucesso! " + itensApi.size() + " produtos sincronizados.");
            }
        } catch (Exception e) {
            System.err.println("[SERVICES ERRO] Falha ao sincronizar: " + e.getMessage());
        }
    }
}
