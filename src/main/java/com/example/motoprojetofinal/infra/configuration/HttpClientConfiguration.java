package com.example.motoprojetofinal.infra.configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestClient;

/**
 * CAMADA: Infra / Configuração
 * O QUE FAZ: Cria o cliente HTTP usado para chamar API externa.
 * POR QUE EXISTE: Centraliza a configuração de timeout e conexão
 * para buscar produtos de fora, sem espalhar isso pelo código.
 */



    @Configuration
    public class HttpClientConfiguration {

        @Bean
        public RestClient restClient() {
            return RestClient.create();
        }
    }


