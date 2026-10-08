package com.example.motoprojetofinal.domain.repository;

import com.example.motoprojetofinal.domain.entities.Cliente;
import com.example.motoprojetofinal.domain.entities.EnumStatusCliente;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ClienteRepository extends JpaRepository<Cliente, Long> {
    Optional<Cliente> findByEmail(String email);
    boolean existsByEmail(String email);
    boolean existsByCpf(String cpf);
    List<Cliente> findByStatus(EnumStatusCliente status);
}