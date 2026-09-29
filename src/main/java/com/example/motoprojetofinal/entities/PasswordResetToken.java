package com.example.motoprojetofinal.entities;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

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