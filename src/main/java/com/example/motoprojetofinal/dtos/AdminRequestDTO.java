package com.example.motoprojetofinal.dtos;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record AdminRequestDTO(
        @NotBlank String nome,
        @NotBlank @Email String email,
        @NotBlank String senha
) {}