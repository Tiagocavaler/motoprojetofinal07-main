package com.example.motoprojetofinal.application.dtos;
/**
 * CAMADA: Application / DTO - ENTRADA
 * O QUE FAZ: É o que o front manda quando clica em "Esqueci a senha".
 * Ex: { "email": "teste@email.com" }
 * POR QUE EXISTE: Só precisa do email para gerar o token de recuperação
 * e mandar por email. Não precisa de senha aqui.
 */

public record ForgotPasswordRequest(String email) {
}
