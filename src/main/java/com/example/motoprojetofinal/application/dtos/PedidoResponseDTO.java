package com.example.motoprojetofinal.application.dtos;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
/**
 * CAMADA: Application / DTO - SAÍDA
 * O QUE FAZ: É o que a API devolve quando busca um Pedido.
 * Ex: { "id": 10, "valorTotal": 150.0, "status": "PENDENTE", "itens": [...] }
 * POR QUE EXISTE: Mostra o pedido pronto, com total calculado e itens,
 * sem expor a Entidade inteira.
 */

public record PedidoResponseDTO(
        Long id,
        LocalDateTime data,
        BigDecimal total,
        String status,
            List<ItemPedidoDTO> itens
) {}