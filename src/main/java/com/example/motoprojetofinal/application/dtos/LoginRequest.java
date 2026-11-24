package com.example.motoprojetofinal.application.dtos;
/**
 * CAMADA: Application / DTO - ENTRADA
 * O QUE FAZ: É o que o front manda para logar.
 * Ex: { "email": "...", "senha": "123" }
 * POR QUE EXISTE: Só carrega o que o login precisa: email + senha.
 * O AuthService valida e devolve o token.
 */

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record LoginRequest(
        @NotBlank @Email String email,
        @NotBlank String senha
) {}