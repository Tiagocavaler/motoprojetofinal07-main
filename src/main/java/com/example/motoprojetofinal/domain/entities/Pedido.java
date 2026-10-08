package com.example.motoprojetofinal.domain.entities;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
public class Pedido {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDateTime dataPedido = LocalDateTime.now();
    private String status = "PENDENTE";
    private BigDecimal total = BigDecimal.ZERO;

    @ManyToOne
    @JoinColumn(name = "cliente_id")
    private Cliente cliente;

    // O JEITO CERTO: Um Pedido tem muitos Itens
    @OneToMany(mappedBy = "pedido", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ItemPedido> itens = new ArrayList<>();
}