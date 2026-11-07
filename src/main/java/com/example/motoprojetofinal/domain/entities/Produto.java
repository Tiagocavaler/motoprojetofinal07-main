package com.example.motoprojetofinal.domain.entities;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import com.example.motoprojetofinal.domain.ValueObjects.QuantidadeEstoque;
import com.example.motoprojetofinal.domain.ValueObjects.Preco;

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

    @Column(name = "ativo_na_loja")
    private Boolean ativoNaLoja = true; // 4. Flag que seu getProdutos() usa: .eq('ativo_na_loja', true)

    // 5. VALUE OBJECTS - validação sem quebrar o Supabase
    // O banco continua BigDecimal / Integer, mas quem valida é o VO
    public void setEstoque(Integer estoque) {
        this.estoque = new QuantidadeEstoque(estoque).valor();
    }

    public void setPreco(BigDecimal preco) {
        this.preco = new Preco(preco).valor();
    }
}