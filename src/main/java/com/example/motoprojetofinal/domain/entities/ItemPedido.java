package com.example.motoprojetofinal.domain.entities;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

/**
 * CAMADA: Domain / Entidade
 * O QUE FAZ: Representa um item dentro de um Pedido.
 * Ex: Pedido 1 tem 2x Produto A + 1x Produto B = 2 ItemPedido.
 * POR QUE EXISTE: Um Pedido tem vários produtos, então precisa dessa
 * tabela intermediária para guardar quantidade, preço na hora da compra
 * e qual produto foi comprado.
 * RELAÇÃO: ManyToOne com Pedido e ManyToOne com Produto.
 */

@Entity
@Data
@NoArgsConstructor
public class ItemPedido {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "pedido_id")
    private Pedido pedido;

    @ManyToOne
    @JoinColumn(name = "produto_id")
    private Produto produto;

    private Integer quantidade;
    private BigDecimal precoUnitario;
}