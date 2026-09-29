package com.example.motoprojetofinal.dtos;

public record LoginResponse(
        String token,
        String email,
        String role
) {}