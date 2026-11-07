package com.example.motoprojetofinal.domain.entities;

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

    @Column(name = "ultimo_acesso")
    private LocalDateTime ultimoAcesso;

    private boolean ativo = true;

    // SET CPF SEM PRECISAR DA CLASSE Cpf - só limpa e deixa só números
    public void setCpf(String cpf) {
        if (cpf == null) {
            this.cpf = null;
            return;
        }
        // tira ponto, traço e espaço: 123.456.789-00 -> 12345678900
        String limpo = cpf.replaceAll("[^0-9]", "");
        this.cpf = limpo;
    }

    public void atualizarStatusAutomatico() {
        // Se nunca comprou, verifica só pelo login/acesso
        if (ultimaCompra == null) {
            // Se nunca logou também, é ATIVO (acabou de cadastrar)
            if (ultimoLogin == null && ultimoAcesso == null) {
                status = EnumStatusCliente.ATIVO;
                ativo = true;
                return;
            }
            // Calcula dias sem logar - usa ultimoAcesso como principal agora
            LocalDateTime referencia = ultimoAcesso != null ? ultimoAcesso : ultimoLogin;
            long diasSemLogar = ChronoUnit.DAYS.between(referencia, LocalDateTime.now());

            if (diasSemLogar <= 30) {
                status = EnumStatusCliente.ATIVO;
                ativo = true;
            } else if (diasSemLogar <= 90) {
                status = EnumStatusCliente.ESPORADICO;
                ativo = true;
            } else {
                status = EnumStatusCliente.INATIVO;
                ativo = false;
            }
            return;
        }

        // Lógica original se já tem compra - compra é mais importante que login
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