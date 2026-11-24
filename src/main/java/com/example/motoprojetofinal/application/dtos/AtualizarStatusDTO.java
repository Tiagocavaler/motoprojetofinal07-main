package com.example.motoprojetofinal.application.dtos;

import com.example.motoprojetofinal.domain.entities.EnumStatusCliente;
/**
 * CAMADA: Application / DTO
 * O QUE FAZ: Carrega o novo status do Cliente para atualizar.
 * Ex: { "status": "INATIVO" }
 * POR QUE EXISTE: Evita mandar o Cliente inteiro só para trocar
 * o status. Manda só o que precisa mudar.
 */

public record AtualizarStatusDTO(
        EnumStatusCliente status
) {}