package com.example.motoprojetofinal.infra.persistence;

import com.example.motoprojetofinal.domain.entities.Administrador;
import com.example.motoprojetofinal.domain.repository.AdministradorRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;
/**
 * CAMADA: Infra / Persistência - Implementação
 * O QUE FAZ: Implementa a interface do domínio (AdministradorRepository)
 * usando o AdministradorJpaRepository por baixo.
 * POR QUE EXISTE: É o adaptador entre o Domínio e o JPA - o domínio
 * não sabe que usamos Spring Data, ele só conhece a interface.
 */

@Repository
public class AdministradorRepositoryImpl implements AdministradorRepository {

    private final AdministradorJpaRepository jpa;

    public AdministradorRepositoryImpl(AdministradorJpaRepository jpa) {
        this.jpa = jpa;
    }

    @Override
    public Administrador salvar(Administrador administrador) {
        return jpa.save(administrador);
    }

    @Override
    public Optional<Administrador> buscarPorId(Long id) {
        return jpa.findById(id);
    }

    @Override
    public Optional<Administrador> buscarPorEmail(String email) {
        return jpa.findByEmail(email);
    }

    @Override
    public void deletar(Long id) {
        jpa.deleteById(id);
    }

    @Override
    public List<Administrador> listarTodos() {
        return jpa.findAll();
    }

    @Override
    public boolean existePorEmail(String email) {
        return jpa.existsByEmail(email);
    }
}