package com.example.motoprojetofinal.application.dtos;

import com.example.motoprojetofinal.domain.entities.EnumStatusCliente;

public record AtualizarStatusDTO(
        EnumStatusCliente status
) {}