package com.example.motoprojetofinal.domain.ValueObjects;


public record Email(String valor) {
    public Email {
        if (valor == null || !valor.contains("@") || !valor.contains(".")) {
            throw new IllegalArgumentException("Email inválido");
        }
    }
}