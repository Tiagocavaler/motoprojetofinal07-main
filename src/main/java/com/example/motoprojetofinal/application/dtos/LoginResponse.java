package com.example.motoprojetofinal.application.dtos;

public record LoginResponse(
        String token,
        String email,
        String role
) {}