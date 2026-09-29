package com.example.motoprojetofinal.repository;

import com.example.motoprojetofinal.entities.Cliente;
import com.example.motoprojetofinal.entities.EnumStatusCliente;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ClienteRepository extends JpaRepository<Cliente, Long> {
    Optional<Cliente> findByEmail(String email);
    boolean existsByEmail(String email);
    boolean existsByCpf(String cpf);
    List<Cliente> findByStatus(EnumStatusCliente status);
}