package com.example.motoprojetofinal.entities;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
@Table(name = "cliente")
@PrimaryKeyJoinColumn(name = "usuario_id")
public class Cliente extends Usuario {
    private String cpf;

    @Enumerated(EnumType.STRING)
    private EnumStatusCliente status = EnumStatusCliente.ATIVO;

    private LocalDateTime ultimaCompra;
    private LocalDateTime ultimoLogin;

    @Column(name = "ultimo_acesso") // 1. NOVO CAMPO - usado pelo PATCH /{id}/acesso do login
    private LocalDateTime ultimoAcesso;

    private boolean ativo = true;

    public void atualizarStatusAutomatico() {
        // 2. Se nunca comprou, verifica só pelo login/acesso - seu caso MotoTrack
        if (ultimaCompra == null) {
            // 3. Se nunca logou também, é ATIVO (acabou de cadastrar)
            if (ultimoLogin == null && ultimoAcesso == null) {
                status = EnumStatusCliente.ATIVO;
                ativo = true;
                return;
            }
            // 4. Calcula dias sem logar - usa ultimoAcesso como principal agora
            LocalDateTime referencia = ultimoAcesso != null ? ultimoAcesso : ultimoLogin;
            long diasSemLogar = ChronoUnit.DAYS.between(referencia, LocalDateTime.now());

            if (diasSemLogar <= 30) {
                status = EnumStatusCliente.ATIVO; // 5. Logou nos últimos 30 dias = ATIVO
                ativo = true;
            } else if (diasSemLogar <= 90) {
                status = EnumStatusCliente.ESPORADICO; // 6. Logou entre 31-90 dias = ESPORADICO
                ativo = true;
            } else {
                status = EnumStatusCliente.INATIVO; // 7. 90+ dias sem logar = INATIVO
                ativo = false;
            }
            return;
        }

        // 8. Lógica original se já tem compra - compra é mais importante que login
        long diasSemComprar = ChronoUnit.DAYS.between(ultimaCompra, LocalDateTime.now());
        long diasSemLogar = ultimoLogin == null ? 999 : ChronoUnit.DAYS.between(ultimoLogin, LocalDateTime.now());

        if (diasSemComprar <= 30) {
            status = EnumStatusCliente.ATIVO;
            ativo = true;
        } else if (diasSemComprar <= 90 && diasSemLogar <= 60) {
            status = EnumStatusCliente.ESPORADICO;
            ativo = true;
        } else {
            status = EnumStatusCliente.INATIVO;
            ativo = false;
        }
    }
}