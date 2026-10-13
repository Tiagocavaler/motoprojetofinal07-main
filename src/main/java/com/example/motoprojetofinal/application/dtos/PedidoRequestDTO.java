package com.example.motoprojetofinal.application.dtos;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public record PedidoRequestDTO(
        @NotNull Long clienteId,
        @NotEmpty List<ItemPedidoDTO> itens
) {}