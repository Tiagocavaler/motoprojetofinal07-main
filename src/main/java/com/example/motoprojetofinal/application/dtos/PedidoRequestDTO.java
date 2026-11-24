package com.example.motoprojetofinal.application.dtos;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.util.List;
/**
 * CAMADA: Application / DTO - ENTRADA
 * O QUE FAZ: É o que o front manda para criar um Pedido.
 * Ex: { "clienteId": 1, "itens": [ { "produtoId": 2, "quantidade": 1 } ] }
 * POR QUE EXISTE: O Controller recebe esse DTO, o Service calcula
 * o valor total, dá baixa no estoque e salva o Pedido.
 */

public record PedidoRequestDTO(
        @NotNull Long clienteId,
        @NotEmpty List<ItemPedidoDTO> itens
) {}