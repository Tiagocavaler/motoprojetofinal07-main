package com.example.motoprojetofinal.domain.repository;

import com.example.motoprojetofinal.domain.entities.PasswordResetToken;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

/**
 * CAMADA: Domain / Repository - INTERFACE
 * O QUE FAZ: Contrato para salvar e buscar token de recuperação de senha.
 * Ex: buscarPorToken, deletar tokens expirados.
 * POR QUE EXISTE: O fluxo de "esqueci a senha" precisa salvar o token
 * sem o Domain saber que é JPA / Postgres.
 */

public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {
    Optional<PasswordResetToken> findByToken(String token);
}