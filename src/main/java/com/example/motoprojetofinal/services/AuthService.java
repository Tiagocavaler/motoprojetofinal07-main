package com.example.motoprojetofinal.services;

import com.example.motoprojetofinal.dtos.LoginRequest;
import com.example.motoprojetofinal.dtos.LoginResponse;
import com.example.motoprojetofinal.entities.Usuario;
import com.example.motoprojetofinal.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final TokenService tokenService;

    public LoginResponse login(LoginRequest dto) {
        Usuario usuario = usuarioRepository.findByEmail(dto.email())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        if (!passwordEncoder.matches(dto.senha(), usuario.getSenha())) {
            throw new RuntimeException("Senha inválida");
        }

        String token = tokenService.gerarToken(usuario);

        return new LoginResponse(
                token,
                usuario.getEmail(),
                usuario.getRole().name()
        );
    }
}