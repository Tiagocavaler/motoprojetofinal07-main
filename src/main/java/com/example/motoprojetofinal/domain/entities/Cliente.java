package com.example.motoprojetofinal.domain.entities;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "clientes")
@PrimaryKeyJoinColumn(name = "id")
public class Cliente extends Usuario {

    @Column(unique = true)
    private String cpf;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EnumStatusCliente status = EnumStatusCliente.ATIVO;

    @Column
    private Boolean ativo = true;

    @Column
    private LocalDateTime ultimoLogin;

    @Column
    private LocalDateTime ultimoAcesso;

    @Column
    private LocalDateTime ultimaCompra;

    public void atualizarStatusAutomatico() {
        if (ultimaCompra != null && ultimaCompra.isBefore(LocalDateTime.now().minusMonths(6))) {
            this.status = EnumStatusCliente.INATIVO;
        }
    }
}