package com.example.motoprojetofinal.domain.entities;

import jakarta.persistence.*;
import lombok.*;
import java.util.UUID;
/**
 * CAMADA: Domain / Entidade
 * O QUE FAZ: Representa o Administrador do sistema. Herda tudo de Usuario
 * (id, nome, email, senha, role) e adiciona a matrícula (ex: ADM-XXXXXX).
 * HERANÇA: @Inheritance JOINED - fica numa tabela separada 'administrador'
 * ligada pelo usuario_id com a tabela 'usuario'.
 * REGRA: Só quem tem Role.ADMINISTRADOR pode gerenciar produtos e pedidos.
 */

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
@Table(name = "administrador")
@PrimaryKeyJoinColumn(name = "usuario_id")
public class Administrador extends Usuario {

    @Column(unique = true)
    private String matricula;

    // Offline-first - estava faltando aqui, por isso o getSincronizado() não existia
    private Boolean sincronizado = false;
    private String origem = "LOCAL";

    @PrePersist
    public void gerarMatricula() {
        if (this.matricula == null || this.matricula.isBlank()) {
            this.matricula = "ADM-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        }
        // garante offline-first herdado do Usuario
        if (getOrigem() == null) setOrigem("LOCAL");
        if (getSincronizado() == null) setSincronizado(false);
    }
}