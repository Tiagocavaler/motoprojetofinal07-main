package com.example.motoprojetofinal.domain.entities;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.example.motoprojetofinal.domain.ValueObjects.QuantidadeEstoque;
import com.example.motoprojetofinal.domain.ValueObjects.Preco;

/**
 * CAMADA: Domain / Entidade
 * O QUE FAZ: Representa o Produto do catálogo.
 * Guarda nome, preço, estoque, descrição e origem (LOCAL ou API EXTERNA).
 * POR QUE EXISTE: É o que aparece para vender. Pode vir cadastrado na mão
 * ou sincronizado da API externa.
 */

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

    @Column(name = "ativo_na_loja")
    private Boolean ativoNaLoja = true; // Flag que seu getProdutos() usa: .eq('ativo_na_loja', true)

    private Boolean sincronizado = false;
    private String origem = "LOCAL";
    private String imagemUrl;
    private LocalDateTime updatedAt;

    // 5. VALUE OBJECTS - validação sem quebrar o Supabase
    // O banco continua BigDecimal / Integer, mas quem valida é o VO
    public void setEstoque(Integer estoque) {
        this.estoque = new QuantidadeEstoque(estoque).valor();
    }

    public void setPreco(BigDecimal preco) {
        this.preco = new Preco(preco).valor();
    }
}