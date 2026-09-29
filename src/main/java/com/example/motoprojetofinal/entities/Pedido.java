package com.example.motoprojetofinal.entities;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
public class Pedido {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDateTime dataPedido = LocalDateTime.now();
    private String status = "PENDENTE"; // PENDENTE ou ENTREGUE no servidor

    // Um Cliente pode ter vários Pedidos
    @ManyToOne
    @JoinColumn(name = "cliente_id")
    private Cliente cliente;

    // Um Pedido pode ter vários Produtos (Pals), e um Produto pode estar em vários Pedidos
    @ManyToMany
    @JoinTable(
            name = "pedido_produtos",
            joinColumns = @JoinColumn(name = "pedido_id"),
            inverseJoinColumns = @JoinColumn(name = "produto_id")
    )
    private List<Produto> produtos;
}
