package com.example.motoprojetofinal.domain.repository;

import com.example.motoprojetofinal.domain.entities.Pedido;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PedidoRepository extends JpaRepository<Pedido, Long> {
    // O Spring Data JPA cria as operações automáticas baseadas no ID do tipo Long
}
