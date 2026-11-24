package com.example.motoprojetofinal.infra.persistence;

import com.example.motoprojetofinal.domain.entities.Administrador;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
/**
 * CAMADA: Infra / Persistência - Interface Spring Data JPA
 * O QUE FAZ: Interface que o Spring implementa sozinho para fazer
 * SELECT/INSERT/UPDATE na tabela 'administrador' no Supabase.
 * POR QUE EXISTE: Não tem código dentro, o Spring gera a implementação
 * em tempo de execução a partir do nome dos métodos (ex: findByEmail).
 */

public interface AdministradorJpaRepository extends JpaRepository<Administrador, Long> {
    Optional<Administrador> findByEmail(String email);
    boolean existsByEmail(String email);
}