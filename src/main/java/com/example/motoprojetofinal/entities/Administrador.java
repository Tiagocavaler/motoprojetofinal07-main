package com.example.motoprojetofinal.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import java.util.UUID;

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

    @PrePersist
    public void gerarMatricula() {
        if (this.matricula == null || this.matricula.isBlank()) {
            this.matricula = "ADM-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        }
    }
}