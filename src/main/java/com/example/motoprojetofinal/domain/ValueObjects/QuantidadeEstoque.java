package com.example.motoprojetofinal.domain.ValueObjects;

/**
 * CAMADA: Domain / Value Object
 * O QUE FAZ: Representa a quantidade em estoque de um Produto.
 * Não deixa criar quantidade negativa e tem métodos para dar
 * baixa no estoque (vender) e repor (comprar).
 * POR QUE EXISTE: Evita vender produto sem estoque. A regra
 * "não pode ficar negativo" fica aqui, num lugar só.
 * EXEMPLO: Se tem 5 e tenta vender 10, ele bloqueia.
 * NO BANCO: Continua salvo como Integer, o Value Object só garante
 * que o valor que entra é válido.
 */

public record QuantidadeEstoque(int valor) {
    public QuantidadeEstoque {
        if (valor < 0) {
            throw new IllegalArgumentException("Estoque não pode ser negativo");
        }
    }
}