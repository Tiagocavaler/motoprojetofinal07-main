package com.example.motoprojetofinal.application.dtos;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
/**
 * CAMADA: Application / DTO - ENTRADA
 * O QUE FAZ: É o que o front manda quando quer criar um Admin.
 * Ex: { "nome": "Tiago", "email": "...", "senha": "123" }
 * POR QUE EXISTE: O Controller não recebe a Entidade direto,
 * recebe esse DTO. Assim o front não manda campos que não deve,
 * como id ou role, e não vê a senha criptografada.
 */

public record AdminRequestDTO(
        @NotBlank String nome,
        @NotBlank @Email String email,
        @NotBlank String senha
) {}