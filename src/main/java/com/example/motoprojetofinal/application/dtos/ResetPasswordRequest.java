package com.example.motoprojetofinal.application.dtos;

import jakarta.validation.constraints.NotBlank;

public record ResetPasswordRequest(
        @NotBlank String token,
        @NotBlank String novaSenha
) {}