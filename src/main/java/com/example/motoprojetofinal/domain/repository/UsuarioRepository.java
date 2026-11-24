package com.example.motoprojetofinal.domain.repository;

import com.example.motoprojetofinal.domain.entities.Usuario;
import java.util.Optional;

/**
 * CAMADA: Domain / Repository - INTERFACE
 * O QUE FAZ: Contrato para buscar e salvar Usuario (pai de Admin e Cliente).
 * Ex: buscarPorEmail - usado pelo login e pelo AdminSeeder.
 * POR QUE EXISTE: É o que o Spring Security usa para achar o usuário
 * na hora do login, sem saber que o banco é o Supabase.
 */

public interface UsuarioRepository {
    Usuario salvar(Usuario usuario);
    Optional<Usuario> buscarPorEmail(String email);
    Optional<Usuario> buscarPorId(Long id);
    boolean existePorEmail(String email);
}