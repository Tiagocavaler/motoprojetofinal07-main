package com.example.motoprojetofinal.application.dtos;
/**
 * CAMADA: Application / DTO - SAÍDA
 * O QUE FAZ: É o que a API devolve depois do login com sucesso.
 * Ex: { "token": "eyJhbGciOi...", "tipo": "Bearer", "role": "CLIENTE" }
 * POR QUE EXISTE: O front guarda esse token JWT e manda ele em
 * toda requisição seguinte no header Authorization.
 */

public record LoginResponse(
        String token,
        String email,
        String role
) {}