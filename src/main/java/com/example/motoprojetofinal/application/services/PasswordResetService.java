package com.example.motoprojetofinal.application.services;

import com.example.motoprojetofinal.domain.repository.ClienteRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
@RequiredArgsConstructor
@Slf4j
public class PasswordResetService {

    private final ClienteRepository clienteRepository;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;

    private final Map<String, TokenInfo> tokens = new ConcurrentHashMap<>();
    private final Map<String, Integer> tentativas = new ConcurrentHashMap<>();
    private final Map<String, LocalDateTime> bloqueio = new ConcurrentHashMap<>();

    public void forgotPassword(String email) {
        gerarTokenRecuperacao(email);
    }

    @Transactional
    public void gerarTokenRecuperacao(String email) {
        String emailLimpo = email.toLowerCase().trim();

        // Verifica bloqueio de 15min
        if (bloqueio.containsKey(emailLimpo) && bloqueio.get(emailLimpo).isAfter(LocalDateTime.now())) {
            throw new RuntimeException("Limite de tentativas excedido. Tente em 15 minutos");
        }
        if (bloqueio.containsKey(emailLimpo) && bloqueio.get(emailLimpo).isBefore(LocalDateTime.now())) {
            bloqueio.remove(emailLimpo);
            tentativas.remove(emailLimpo);
        }

        int count = tentativas.getOrDefault(emailLimpo, 0);
        if (count >= 3) {
            bloqueio.put(emailLimpo, LocalDateTime.now().plusMinutes(15));
            throw new RuntimeException("Limite de tentativas excedido. Tente em 15 minutos");
        }
        tentativas.put(emailLimpo, count + 1);

        var clienteOpt = clienteRepository.findByEmail(emailLimpo);
        if (clienteOpt.isEmpty()) {
            log.warn("Tentativa de reset para email inexistente: {}", emailLimpo);
            return; // Não revela que não existe
        }

        String token = UUID.randomUUID().toString();
        tokens.put(token, new TokenInfo(emailLimpo, LocalDateTime.now().plusMinutes(30)));

        emailService.enviarLinkReset(emailLimpo, token);
        log.info("Token de recuperação gerado para: {}", emailLimpo);
    }

    @Transactional
    public void resetarSenha(String token, String novaSenha) {
        TokenInfo info = tokens.get(token);
        if (info == null || info.expiracao.isBefore(LocalDateTime.now())) {
            if (info != null) tokens.remove(token);
            throw new RuntimeException("Token inválido ou expirado");
        }

        var cliente = clienteRepository.findByEmail(info.email)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        cliente.setSenha(passwordEncoder.encode(novaSenha));
        cliente.setUpdatedAt(LocalDateTime.now());
        clienteRepository.save(cliente);

        tokens.remove(token);
        tentativas.remove(info.email);
        bloqueio.remove(info.email);
        log.info("Senha resetada com sucesso para: {}", info.email);
    }

    private record TokenInfo(String email, LocalDateTime expiracao) {}
}