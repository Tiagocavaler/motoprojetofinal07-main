package com.example.motoprojetofinal.dtos;

public record ClienteRequestDTO(
        String nome,
        String cpf,
        String email,
        String senha
) {}