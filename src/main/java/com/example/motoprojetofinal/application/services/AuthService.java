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

        var usuario = usuarioRepository.findByEmail(email)
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