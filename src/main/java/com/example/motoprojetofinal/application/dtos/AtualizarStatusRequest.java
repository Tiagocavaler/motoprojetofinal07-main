package com.example.motoprojetofinal.application.dtos;

import com.example.motoprojetofinal.domain.entities.EnumStatusCliente;
/**
 * CAMADA: Application / DTO - ENTRADA
 * O QUE FAZ: É o que o front manda para pedir a troca de status.
 * Ex: { "clienteId": 5, "novoStatus": "ATIVO" }
 * POR QUE EXISTE: Separa o que vem do front do que é Entidade.
 * O Service valida e depois aplica na Entidade Cliente.
 */

public record AtualizarStatusRequest(
        EnumStatusCliente status
) {}