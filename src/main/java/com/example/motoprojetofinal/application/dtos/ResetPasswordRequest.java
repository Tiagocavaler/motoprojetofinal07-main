package com.example.motoprojetofinal.application.dtos;

import jakarta.validation.constraints.NotBlank;
/**
 * CAMADA: Application / DTO - ENTRADA
 * O QUE FAZ: É o que o front manda para trocar a senha de fato.
 * Ex: { "token": "abc123", "novaSenha": "nova123" }
 * POR QUE EXISTE: O Service valida se o token existe e não expirou,
 * aí sim troca a senha no banco.
 */

public record ResetPasswordRequest(
        @NotBlank String token,
        @NotBlank String novaSenha
) {}