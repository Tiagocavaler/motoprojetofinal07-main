package com.example.motoprojetofinal.application.dtos;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import org.hibernate.validator.constraints.br.CPF;
/**
 * CAMADA: Application / DTO - ENTRADA
 * O QUE FAZ: É o que o front manda quando cadastra um Cliente.
 * Ex: { "nome": "...", "email": "...", "cpf": "...", "senha": "..." }
 * POR QUE EXISTE: O Controller recebe esse DTO, não a Entidade.
 * Assim o front não consegue mandar id, status ou data de cadastro.
 */

public record ClienteRequestDTO(
        @NotBlank(message = "Nome é obrigatório")
        String nome,

        @NotBlank(message = "CPF é obrigatório")
        @CPF(message = "CPF inválido")
        String cpf,

        @NotBlank(message = "Email é obrigatório")
        @Email(message = "Email inválido")
        String email,

        @NotBlank(message = "Senha é obrigatória")
        String senha
) {}