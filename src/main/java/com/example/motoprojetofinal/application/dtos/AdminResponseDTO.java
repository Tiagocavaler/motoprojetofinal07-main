package com.example.motoprojetofinal.application.dtos;

import com.example.motoprojetofinal.domain.entities.Role;
/**
 * CAMADA: Application / DTO - SAÍDA
 * O QUE FAZ: É o que a API devolve quando busca um Admin.
 * Ex: { "id": 1, "nome": "Tiago", "email": "...", "matricula": "ADM-..." }
 * POR QUE EXISTE: Nunca devolve a Entidade com a senha. Esse DTO
 * esconde a senha e só mostra o que o front pode ver.
 */

public record AdminResponseDTO(
        Long id,
        String nome,
        String email,
        Role role
) {}