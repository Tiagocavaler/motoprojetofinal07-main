package com.example.motoprojetofinal.infra.persistence;

import com.example.motoprojetofinal.domain.entities.Administrador;
import com.example.motoprojetofinal.domain.repository.AdministradorRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

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
}