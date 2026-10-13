package com.example.motoprojetofinal.domain.repository;
import com.example.motoprojetofinal.domain.entities.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    Optional<Usuario> findByEmail(String email);
    Optional<Usuario> findByEmailIgnoreCase(String email);
    boolean existsByEmailIgnoreCase(String email);
    List<Usuario> findByAtivoNaLojaTrue();
    List<Usuario> findBySincronizadoFalse();
}