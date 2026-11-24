package com.example.motoprojetofinal.domain.repository;

import com.example.motoprojetofinal.domain.entities.Cliente;
import com.example.motoprojetofinal.domain.entities.EnumStatusCliente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

/**
 * CAMADA: Domain / Repository - INTERFACE
 * O QUE FAZ: Contrato para buscar e salvar Cliente.
 * Ex: buscarPorCpf, buscarPorEmail, listar todos.
 * POR QUE EXISTE: O Domain define o que precisa, a Infra implementa
 * com JPA. O Domain nunca sabe que o banco é Postgres / Supabase.
 */

@Repository
public interface ClienteRepository extends JpaRepository<Cliente, Long> {

    // Offline: lista do H2 local - professor apaga Supabase e continua
    List<Cliente> findByAtivoTrue();
    List<Cliente> findByStatus(EnumStatusCliente status);

    // Sync: o que precisa enviar pro Supabase quando voltar online
    List<Cliente> findBySincronizadoFalse();

    // Regra de ignorar repetido - mantém o mais antigo
    boolean existsByCpf(String cpf);
    Optional<Cliente> findByCpf(String cpf);

    boolean existsByEmail(String email);
    Optional<Cliente> findByEmail(String email);
}