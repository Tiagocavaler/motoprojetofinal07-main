package com.example.motoprojetofinal.infra.external;

import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import java.util.List;
import java.util.Map;

/**
 * CAMADA: Infra / Externa
 * O QUE FAZ: Faz a chamada HTTP para a API externa de produtos
 * e converte a resposta para o formato do nosso sistema.
 * POR QUE EXISTE: Isola a dependência externa - se a API de fora
 * mudar, só mexe aqui, não no resto do projeto.
 */

@Component
public class ProdutoApiExternaClient {

    private final RestClient restClient = RestClient.builder()
            .baseUrl("https://raw.githubusercontent.com")
            .build();

    public List<Map<String, Object>> buscarProdutosExternos() {
        String endpoint = "/seu-usuario/seu-repo/main/produtos.json";

        return restClient.get()
                .uri(endpoint)
                .retrieve()
                .body(new ParameterizedTypeReference<List<Map<String, Object>>>() {});
    }
}