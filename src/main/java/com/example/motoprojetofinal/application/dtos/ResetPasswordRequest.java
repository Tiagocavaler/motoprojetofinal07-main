package com.example.motoprojetofinal.application.dtos;

public record ResetPasswordRequest(
        String token,
        String novaSenha
) {}