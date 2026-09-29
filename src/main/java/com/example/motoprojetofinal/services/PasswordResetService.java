package com.example.motoprojetofinal.services;

import com.example.motoprojetofinal.repository.ClienteRepository;
import com.example.motoprojetofinal.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
@RequiredArgsConstructor
public class PasswordResetService {

    private final ClienteRepository clienteRepository;
    private final UsuarioRepository usuarioRepository;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;

    private final Map<String, TokenInfo> tokens = new ConcurrentHashMap<>();
    private final Map<String, Integer> tentativas = new ConcurrentHashMap<>();

    // Nome que seu AuthController chama
    public void forgotPassword(String email) {
        gerarTokenRecuperacao(email);
    }
    public void resetPassword(String token, String novaSenha) {
        recuperarSenha(token, novaSenha);
    }

    // Nome que seu ClienteController chama - mantém os 2
    public void gerarTokenRecuperacao(String email) {
        String emailLimpo = email.toLowerCase().trim();
        boolean existe = clienteRepository.findByEmail(emailLimpo).isPresent() ||
                usuarioRepository.findByEmail(emailLimpo).isPresent();
        if (!existe) return;

        int qtd = tentativas.getOrDefault(emailLimpo, 0);
        if (qtd >= 3) throw new RuntimeException("Limite de 3 solicitacoes por dia");
        tentativas.put(emailLimpo, qtd + 1);

        String token = UUID.randomUUID().toString();
        tokens.put(token, new TokenInfo(emailLimpo, LocalDateTime.now().plusMinutes(30)));
        emailService.enviarLinkReset(emailLimpo, token);
    }

    public void recuperarSenha(String token, String novaSenha) {
        TokenInfo info = tokens.get(token);
        if (info == null || info.expiracao.isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Token invalido ou expirado");
        }
        clienteRepository.findByEmail(info.email).ifPresent(c -> {
            c.setSenha(passwordEncoder.encode(novaSenha));
            clienteRepository.save(c);
        });
        usuarioRepository.findByEmail(info.email).ifPresent(u -> {
            u.setSenha(passwordEncoder.encode(novaSenha));
            usuarioRepository.save(u);
        });
        tokens.remove(token);
    }

    private record TokenInfo(String email, LocalDateTime expiracao) {}
}