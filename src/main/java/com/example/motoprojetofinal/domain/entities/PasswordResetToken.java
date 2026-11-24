package com.example.motoprojetofinal.domain.entities;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

/**
 * CAMADA: Domain / Entidade
 * O QUE FAZ: Representa o token de recuperação de senha.
 * Guarda o token, o usuário dono dele e a data de expiração.
 * POR QUE EXISTE: Quando o usuário clica em "esqueci a senha", gera
 * um token único que só vale por um tempo. Sem token válido, não
 * deixa trocar a senha.
 */

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PasswordResetToken {
    @Id @GeneratedValue
    private Long id;
    private String token;
    private String email;
    private LocalDateTime expiracao;
    private boolean usado = false;
}