package com.example.motoprojetofinal.domain.repository;

import com.example.motoprojetofinal.domain.entities.Usuario;
import java.util.Optional;

public interface UsuarioRepository {
    Usuario salvar(Usuario usuario);
    Optional<Usuario> buscarPorEmail(String email);
    Optional<Usuario> buscarPorId(Long id);
    boolean existePorEmail(String email);
}