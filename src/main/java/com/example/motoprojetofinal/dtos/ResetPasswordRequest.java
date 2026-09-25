package com.example.motoprojetofinal.dtos;

public record ResetPasswordRequest(
        String token,
        String novaSenha
) {}