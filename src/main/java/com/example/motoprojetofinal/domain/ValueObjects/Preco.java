package com.example.motoprojetofinal.domain.ValueObjects;

import java.math.BigDecimal;
/**
 * CAMADA: Domain / Value Object
 * O QUE FAZ: Representa o preço de um Produto. Não deixa criar preço
 * negativo, zero ou nulo.
 * POR QUE EXISTE: Garante que nunca vai ter um produto com preço -10
 * no banco por erro de digitação. A regra "preço tem que ser > 0"
 * fica aqui, não no Controller.
 * NO BANCO: Continua salvo como BigDecimal / Double, o Value Object
 * só garante que o valor que entra é válido.
 */

public record Preco(BigDecimal valor) {
    public Preco {
        if (valor == null || valor.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Preço deve ser maior que zero");
        }
    }
}