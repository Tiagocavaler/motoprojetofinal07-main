package com.example.motoprojetofinal.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

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
    private EnumStatusCliente status;
}