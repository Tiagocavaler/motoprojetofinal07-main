package com.example.motoprojetofinal.dtos;

import com.example.motoprojetofinal.entities.EnumStatusCliente;
import com.example.motoprojetofinal.entities.Role;
import java.time.LocalDateTime;

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