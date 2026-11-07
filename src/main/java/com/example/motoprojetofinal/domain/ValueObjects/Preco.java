package com.example.motoprojetofinal.domain.ValueObjects;

import java.math.BigDecimal;

public record Preco(BigDecimal valor) {
    public Preco {
        if (valor == null || valor.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Preço deve ser maior que zero");
        }
    }
}