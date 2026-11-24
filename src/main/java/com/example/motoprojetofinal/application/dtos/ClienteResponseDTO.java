package com.example.motoprojetofinal.application.dtos;

import com.example.motoprojetofinal.domain.entities.EnumStatusCliente;
import com.example.motoprojetofinal.domain.entities.Role;
import java.time.LocalDateTime;
/**
 * CAMADA: Application / DTO - SAÍDA
 * O QUE FAZ: É o que a API devolve quando busca um Cliente.
 * Ex: { "id": 1, "nome": "...", "email": "...", "cpf": "...", "status": "ATIVO" }
 * POR QUE EXISTE: Nunca devolve a Entidade com a senha. Esconde a senha
 * e só mostra o que o front pode ver.
 */

public record ClienteResponseDTO(
        Long id,
        String nome,
        String cpf,
        String email,
        Role role,
        EnumStatusCliente status,
        LocalDateTime ultimoAcesso, // 1. NOVO - vem da entity Cliente.ultimoAcesso - usado pra calcular ESPORADICO/INATIVO
        LocalDateTime ultimoLogin, // 2. NOVO - ultimo login real
        LocalDateTime ultimaCompra // 3. NOVO - ultima compra - pro admin ver
) {}