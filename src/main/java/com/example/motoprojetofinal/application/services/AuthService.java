package com.example.motoprojetofinal.application.services;

import com.example.motoprojetofinal.application.dtos.LoginRequest;
import com.example.motoprojetofinal.application.dtos.LoginResponse;
import com.example.motoprojetofinal.domain.entities.Cliente;
import com.example.motoprojetofinal.domain.repository.ClienteRepository;
import com.example.motoprojetofinal.domain.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
/**
 * CAMADA: Application / Service - REGRA DE NEGÓCIO
 * O QUE FAZ: Tem toda a regra de Admin. Criar admin, listar, buscar,
 * gerar matrícula ADM-XXXXXX.
 * POR QUE EXISTE: O Controller só recebe HTTP, quem decide a regra
 * é aqui. Ex: não deixa criar 2 admins com o mesmo email.
 */

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final ClienteRepository clienteRepository;
    private final PasswordEncoder passwordEncoder;
    private final TokenService tokenService;

    @Transactional
    public LoginResponse login(LoginRequest dto) {
        String email = dto.email().toLowerCase().trim();

        var usuario = usuarioRepository.buscarPorEmail(email)
                .orElseThrow(() -> new RuntimeException("E-mail ou senha incorretos"));

        if (!passwordEncoder.matches(dto.senha(), usuario.getSenha())) {
            throw new RuntimeException("E-mail ou senha incorretos");
        }

        if (usuario instanceof Cliente cliente) {
            cliente.setUltimoAcesso(LocalDateTime.now());
            cliente.setUltimoLogin(LocalDateTime.now());
            cliente.atualizarStatusAutomatico();
            clienteRepository.save(cliente);
            log.info("Login cliente: {} - status: {}", cliente.getEmail(), cliente.getStatus());
        }

        String token = tokenService.gerarToken(usuario);
        return new LoginResponse(token, usuario.getEmail(), usuario.getRole().name());
    }
}