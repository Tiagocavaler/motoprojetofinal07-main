package com.example.motoprojetofinal.domain.entities;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "produtos")
public class Produto {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;

    private String tipo;

    @Column(precision = 10, scale = 2)
    private BigDecimal preco;

    private Integer estoque = 0;

    private Boolean ativoNaLoja = true;
    private Boolean sincronizado = false;
    private String origem = "LOCAL";
    private String imagemUrl;
    private LocalDateTime updatedAt;

    @PrePersist
    @PreUpdate
    public void preSave() {
        this.updatedAt = LocalDateTime.now();
        if(this.origem == null) this.origem = "LOCAL";
        if(this.sincronizado == null) this.sincronizado = false;
        if(this.ativoNaLoja == null) this.ativoNaLoja = true;
        if(this.estoque == null) this.estoque = 0;
    }
}