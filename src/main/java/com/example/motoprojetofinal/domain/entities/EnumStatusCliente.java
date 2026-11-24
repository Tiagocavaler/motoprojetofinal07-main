package com.example.motoprojetofinal.domain.entities;

/**
 * CAMADA: Domain / Enum
 * O QUE FAZ: Lista os únicos status possíveis de um Cliente:
 * ATIVO, ESPORADICO e INATIVO.
 * POR QUE EXISTE: Evita erro de digitação - em vez de escrever String
 * solta "ativo", "Ativo", o código só aceita um desses 3 valores.
 */

public enum EnumStatusCliente {
    ATIVO,
    ESPORADICO,
    INATIVO,
    EXCLUIDO
}