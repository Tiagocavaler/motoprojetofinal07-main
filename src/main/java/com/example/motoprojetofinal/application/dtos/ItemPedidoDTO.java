package com.example.motoprojetofinal.application.dtos;
/**
 * CAMADA: Application / DTO
 * O QUE FAZ: Representa um item dentro do Pedido que vem do front.
 * Ex: { "produtoId": 2, "quantidade": 3 }
 * POR QUE EXISTE: O Pedido tem vários itens, então o front manda
 * uma lista desses DTOs dentro do PedidoRequestDTO.
 */

public record ItemPedidoDTO(
        Long produtoId,
        Integer quantidade
) {}