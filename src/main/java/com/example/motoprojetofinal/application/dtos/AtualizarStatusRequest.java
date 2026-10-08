package com.example.motoprojetofinal.application.dtos;

import com.example.motoprojetofinal.domain.entities.EnumStatusCliente;

public record AtualizarStatusRequest(
        EnumStatusCliente status
) {}