package com.example.motoprojetofinal.infra.configuration;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
/**
 * CAMADA: Infra / Segurança
 * O QUE FAZ: Define as regras de segurança: quais rotas são públicas
 * (login, cadastro), quais precisam de token e qual é a senha criptografada (BCrypt).
 * POR QUE EXISTE: É o coração do Spring Security do projeto.
 */

@Configuration
public class SwaggerConfiguration {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .addSecurityItem(new SecurityRequirement().addList("bearerAuth"))
                .components(new Components().addSecuritySchemes("bearerAuth",
                        new SecurityScheme()
                                .type(SecurityScheme.Type.HTTP)
                                .scheme("bearer")
                                .bearerFormat("JWT")
                ))
                .info(new Info()
                        .title("motoprojeto-final")
                        .version("1.0")
                        .description("API Documentation")
                );
    }
}