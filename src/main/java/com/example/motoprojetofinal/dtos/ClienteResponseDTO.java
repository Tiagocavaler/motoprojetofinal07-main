package com.example.motoprojetofinal.dtos;

import com.example.motoprojetofinal.entities.EnumStatusCliente;
import com.example.motoprojetofinal.entities.Role;

public record ClienteResponseDTO(
        Long id,
        String nome,
        String cpf,
        String email,
        Role role,
        EnumStatusCliente status
) {}