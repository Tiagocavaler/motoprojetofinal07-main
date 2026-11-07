package com.example.motoprojetofinal.infra.persistence;

import com.example.motoprojetofinal.domain.entities.Administrador;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface AdministradorJpaRepository extends JpaRepository<Administrador, Long> {
    Optional<Administrador> findByEmail(String email);
}