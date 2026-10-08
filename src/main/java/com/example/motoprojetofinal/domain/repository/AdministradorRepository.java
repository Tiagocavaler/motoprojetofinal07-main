package com.example.motoprojetofinal.domain.repository;
import com.example.motoprojetofinal.domain.entities.Administrador;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface AdministradorRepository extends JpaRepository<Administrador, Long> {
    Optional<Administrador> findByEmail(String email);
}