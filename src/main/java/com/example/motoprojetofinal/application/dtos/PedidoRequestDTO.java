package com.example.motoprojetofinal.application.dtos;

import java.util.List;

public record PedidoRequestDTO(
        Long clienteId,
        List<ItemPedidoDTO> itens
) {}