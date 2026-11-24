package com.example.motoprojetofinal.domain.ValueObjects;
/**
 * CAMADA: Domain / Value Object
 * O QUE FAZ: Representa um Email válido. Não é uma String qualquer.
 * No construtor ele já valida: se vier sem @, sem domínio ou vazio,
 * ele lança exceção e não deixa criar.
 * POR QUE EXISTE: Em vez de validar email espalhado em 10 lugares
 * (Controller, Service, Entidade), a validação fica num lugar só.
 * EXEMPLO: new Email("teste@") -> erro. new Email("teste@email.com") -> ok.
 * NO BANCO: Continua salvo como String, o Value Object só garante
 * que o valor que entra é válido.
 */

public record Email(String valor) {
    public Email {
        if (valor == null || !valor.contains("@") || !valor.contains(".")) {
            throw new IllegalArgumentException("Email inválido");
        }
    }
}