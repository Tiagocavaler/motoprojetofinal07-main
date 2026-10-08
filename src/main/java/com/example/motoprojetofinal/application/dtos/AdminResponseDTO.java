package com.example.motoprojetofinal.application.dtos;

import com.example.motoprojetofinal.domain.entities.Role;

public record AdminResponseDTO(
        Long id,
        String nome,
        String email,
        Role role
) {}