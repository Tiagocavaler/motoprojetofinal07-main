package com.example.motoprojetofinal.dtos;

import com.example.motoprojetofinal.entities.EnumStatusCliente;

public record AtualizarStatusRequest(
        EnumStatusCliente status
) {}