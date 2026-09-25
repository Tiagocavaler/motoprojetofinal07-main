package com.example.motoprojetofinal.dtos;

import com.example.motoprojetofinal.entities.Role;

public record AdminResponseDTO(
        Long id,
        String nome,
        String email,
        Role role
) {}