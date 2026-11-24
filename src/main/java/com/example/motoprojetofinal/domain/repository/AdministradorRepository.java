package com.example.motoprojetofinal.domain.repository;

import com.example.motoprojetofinal.domain.entities.Administrador;
import java.util.List;
import java.util.Optional;
/**
 * CAMADA: Domain / Repository - INTERFACE
 * O QUE FAZ: Contrato que diz O QUE dá pra fazer com Administrador,
 * sem dizer COMO. Ex: buscarPorEmail, salvar.
 * POR QUE EXISTE: O Domain não pode depender do JPA / Supabase.
 * Quem implementa de verdade é a camada Infra (AdministradorRepositoryImpl).
 * PADRÃO: Inversão de dependência - Domain define, Infra obedece.
 */

public interface AdministradorRepository {
    Administrador salvar(Administrador administrador);
    Optional<Administrador> buscarPorId(Long id);
    Optional<Administrador> buscarPorEmail(String email);
    void deletar(Long id);
    List<Administrador> listarTodos();
    boolean existePorEmail(String email);
}