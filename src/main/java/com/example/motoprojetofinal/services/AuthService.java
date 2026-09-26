package com.example.motoprojetofinal.services;

import com.example.motoprojetofinal.dtos.LoginRequest;
import com.example.motoprojetofinal.dtos.LoginResponse;
import com.example.motoprojetofinal.entities.Cliente;
import com.example.motoprojetofinal.repository.ClienteRepository;
import com.example.motoprojetofinal.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final ClienteRepository clienteRepository;
    private final PasswordEncoder passwordEncoder;
    private final TokenService tokenService;

    public LoginResponse login(LoginRequest dto) {
        String email = dto.email().toLowerCase().trim();
        String senhaDigitada = dto.senha();

        System.out.println("Tentando login: " + email);

        var usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("E-mail ou senha incorretos"));

        if (!passwordEncoder.matches(senhaDigitada, usuario.getSenha())) {
            throw new RuntimeException("E-mail ou senha incorretos");
        }

        // ATUALIZA SEU CAMPO NOVO ultimo_acesso se for Cliente
        if (usuario instanceof Cliente cliente) {
            cliente.setUltimoAcesso(LocalDateTime.now());
            cliente.setUltimoLogin(LocalDateTime.now());
            cliente.atualizarStatusAutomatico();
            clienteRepository.save(cliente);
            System.out.println("Cliente atualizado: " + cliente.getStatus());
        }

        String token = tokenService.gerarToken(usuario);
        return new LoginResponse(token, usuario.getEmail(), usuario.getRole().name());
    }
}