package com.example.motoprojetofinal.domain.ValueObjects;

public record QuantidadeEstoque(int valor) {
    public QuantidadeEstoque {
        if (valor < 0) {
            throw new IllegalArgumentException("Estoque não pode ser negativo");
        }
    }
}