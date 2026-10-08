package com.example.motoprojetofinal.application.dtos;

public record ClienteRequestDTO(
        String nome,
        String cpf,
        String email,
        String senha
) {}