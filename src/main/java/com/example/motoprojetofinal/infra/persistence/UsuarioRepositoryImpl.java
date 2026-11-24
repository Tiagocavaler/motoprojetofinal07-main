package com.example.motoprojetofinal.infra.persistence;

import com.example.motoprojetofinal.domain.entities.Usuario;
import com.example.motoprojetofinal.domain.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import java.util.Optional;
/**
 * CAMADA: Infra / Persistência - Implementação
 * O QUE FAZ: Implementa a interface do domínio (UsuarioRepository)
 * usando o UsuarioJpaRepository por baixo.
 * POR QUE EXISTE: É o adaptador entre o Domínio e o JPA - o domínio
 * não sabe que usamos Spring Data, ele só conhece a interface.
 */

@Repository
@RequiredArgsConstructor
public class UsuarioRepositoryImpl implements UsuarioRepository {

    private final UsuarioJpaRepository jpaRepository;

    @Override
    public Usuario salvar(Usuario usuario) {
        return jpaRepository.save(usuario);
    }

    @Override
    public Optional<Usuario> buscarPorEmail(String email) {
        return jpaRepository.findByEmail(email);
    }

    @Override
    public Optional<Usuario> buscarPorId(Long id) {
        return jpaRepository.findById(id);
    }

    @Override
    public boolean existePorEmail(String email) {
        return jpaRepository.existsByEmail(email);
    }
}