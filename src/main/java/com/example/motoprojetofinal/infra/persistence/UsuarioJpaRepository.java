package com.example.motoprojetofinal.infra.persistence;

import com.example.motoprojetofinal.domain.entities.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

/**
 * CAMADA: Infra / Persistência - Interface Spring Data JPA
 * O QUE FAZ: Interface que o Spring implementa sozinho para fazer
 * SELECT/INSERT/UPDATE na tabela 'usuario'.
 * POR QUE EXISTE: Herança JOINED: quando busca um Usuario, o Hibernate
 * faz JOIN com 'administrador' e 'clientes' para descobrir o tipo.
 */

@Repository
public interface UsuarioJpaRepository extends JpaRepository<Usuario, Long> {
    Optional<Usuario> findByEmail(String email);
    boolean existsByEmail(String email);
}