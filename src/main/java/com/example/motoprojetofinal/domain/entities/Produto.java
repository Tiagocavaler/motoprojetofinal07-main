package com.example.motoprojetofinal.domain.entities;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.math.BigDecimal;
import com.example.motoprojetofinal.domain.ValueObjects.QuantidadeEstoque;
import com.example.motoprojetofinal.domain.ValueObjects.Preco;

@Entity
@Table(name = "produtos") // 1. Garante que mapeia pra mesma tabela do Supabase com 500 imagens
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Produto {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;
    private String tipo;
    private BigDecimal preco;
    private Integer estoque = 0;

    // 2. ESSENCIAIS PRA NÃO PERDER OS BUCKETS
    @Column(name = "imagem_url")
    private String imagemUrl; // 3. Aqui que fica https://...supabase.co/storage/v1/object/public/... com suas 500 URLs

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