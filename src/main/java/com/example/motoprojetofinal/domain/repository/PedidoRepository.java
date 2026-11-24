package com.example.motoprojetofinal.domain.repository;

import com.example.motoprojetofinal.domain.entities.Pedido;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
/**
 * CAMADA: Domain / Repository - INTERFACE
 * O QUE FAZ: Contrato para buscar e salvar Pedido.
 * Ex: listar pedidos de um cliente, buscar por status.
 * POR QUE EXISTE: O Domain define o que precisa, a Infra implementa com JPA.
 */

@Repository
public interface PedidoRepository extends JpaRepository<Pedido, Long> {
}