package com.example.motoprojetofinal.application.services;

import com.example.motoprojetofinal.domain.repository.ClienteRepository;
import com.example.motoprojetofinal.domain.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
@RequiredArgsConstructor
@Slf4j
public class PasswordResetService {

    private final ClienteRepository clienteRepository;
    private final UsuarioRepository usuarioRepository;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;

    private final Map<String, TokenInfo> tokens = new ConcurrentHashMap<>();
    private final Map<String, Integer> tentativas = new ConcurrentHashMap<>();

    public void forgotPassword(String email) {
        gerarTokenRecuperacao(email);
    }

    public void gerarTokenRecuperacao(String email) {
        int count = tentativas.getOrDefault(email, 0);
        if (count >= 3) {
            throw new RuntimeException("Limite de tentativas excedido. Tente em 15 minutos");
        }
        tentativas.put(email, count + 1);

        var clienteOpt = clienteRepository.findByEmail(email);
        if (clienteOpt.isEmpty()) {
            log.warn("Tentativa de reset para email inexistente: {}", email);
            return;
        }

        String token = UUID.randomUUID().toString();
        tokens.put(token, new TokenInfo(email, LocalDateTime.now().plusMinutes(30)));

        // AQUI ESTAVA O ERRO - troquei pra usar seu método que já existe
        emailService.enviarLinkReset(email, token);

        log.info("Token de recuperação gerado para: {}", email);
    }

    public void resetarSenha(String token, String novaSenha) {
        TokenInfo info = tokens.get(token);
        if (info == null || info.expiracao.isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Token inválido ou expirado");
        }

        var cliente = clienteRepository.findByEmail(info.email)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        cliente.setSenha(passwordEncoder.encode(novaSenha));
        clienteRepository.save(cliente);

        tokens.remove(token);
        tentativas.remove(info.email);
        log.info("Senha resetada com sucesso para: {}", info.email);
    }

    private record TokenInfo(String email, LocalDateTime expiracao) {}
}