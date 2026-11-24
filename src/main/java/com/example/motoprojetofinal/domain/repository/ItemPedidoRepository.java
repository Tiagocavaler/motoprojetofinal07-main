package com.example.motoprojetofinal.domain.repository;

import com.example.motoprojetofinal.domain.entities.ItemPedido;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

/**
 * CAMADA: Domain / Repository - INTERFACE
 * O QUE FAZ: Contrato para buscar e salvar ItemPedido.
 * Ex: listar itens de um Pedido.
 * POR QUE EXISTE: Separa a regra de negócio da forma de salvar no banco.
 */

@Repository
public interface ItemPedidoRepository extends JpaRepository<ItemPedido, Long> {
    List<ItemPedido> findByPedidoId(Long pedidoId);
}