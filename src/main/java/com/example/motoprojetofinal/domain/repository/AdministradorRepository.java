package com.example.motoprojetofinal.domain.repository;

import com.example.motoprojetofinal.domain.entities.Administrador;
import java.util.Optional;

public interface AdministradorRepository {
    Administrador salvar(Administrador administrador);
    Optional<Administrador> buscarPorId(Long id);
    Optional<Administrador> buscarPorEmail(String email);
    void deletar(Long id);
}