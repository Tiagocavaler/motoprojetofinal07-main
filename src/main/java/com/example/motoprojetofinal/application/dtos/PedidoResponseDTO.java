package com.example.motoprojetofinal.application.dtos;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record PedidoResponseDTO(
        Long id,
        LocalDateTime data,
        BigDecimal total,
        String status,
            List<ItemPedidoDTO> itens
) {}